using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Google.Apis.Auth;


namespace JISST.IpAllowlist
{
  public class IpRange
  {
    [BsonElement("Name")]
    public string Name { get; set; }

    [BsonElement("IpRangeStart")]
    public string IpRangeStart { get; set; }

    [BsonElement("IpRangeEnd")]
    public string IpRangeEnd { get; set; }

    [BsonElement("Volumes")]
    public List<string> Volumes { get; set; }
  }

  public class EmailAddressConfig
  {
    [BsonElement("Name")]
    public string Name { get; set; }

    [BsonElement("Volume")]
    public string Volume { get; set; }

    [BsonElement("EmailIds")]
    public List<string> EmailIds { get; set; }
  }

public class ManuscriptEmailAddressConfig
  {
    [BsonElement("Name")]
    public string Name { get; set; }

    [BsonElement("EmailIds")]
    public List<string> EmailIds { get; set; }
  }
  public class AllowedIpRangeDocument
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("AllowList")]
    public List<IpRange> AllowList { get; set; }
  }

  public class AllowedEmailAddressesDocument
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("AllowList")]
    public List<EmailAddressConfig> AllowList { get; set; }

    [BsonElement("ManuscriptMailingList")]
    public List<ManuscriptEmailAddressConfig> ManuscriptMailingList { get; set; }
  }

  public static class GetPdfUrl
  {
    [FunctionName("GetPdfUrl")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
        ILogger log, ExecutionContext executionContext)
    {
      log.LogInformation("C# HTTP trigger function processed a request.");

      // Read the IP ranges from the JSON file
      var connectionUri = Environment.GetEnvironmentVariable("MongoDb:ConnectionString");

      var settings = MongoClientSettings.FromConnectionString(connectionUri);
      // Set the ServerApi field of the settings object to Stable API version 1
      settings.ServerApi = new ServerApi(ServerApiVersion.V1);
      // Create a new client and connect to the server
      var client = new MongoClient(settings);

      var allowedIPRanges = await GetAllowedIpRanges(log, client);

      // Get the request IP
      var requestIP = IPAddress.Parse(req.HttpContext.Connection.RemoteIpAddress.ToString());

      (IPAddress, IPAddress, List<string>) allowedIpConfig;

      var allowUsingIp = IsIPInAllowedRanges(requestIP, allowedIPRanges, out allowedIpConfig);

      // Check if the IP is within any allowed range
      if (!allowUsingIp)
      {
        if (string.IsNullOrEmpty(req.Headers["AccessToken"].ToString()))
        {
          return new BadRequestObjectResult($"Your IP is not allowed. Please login/sign-up with google if you have individual access.");
        }
      }
      
      // Send a ping to confirm a successful connection
      string fileUrl = string.Empty;
      try
      {
        var filter = Builders<BsonDocument>.Filter.Eq("item_id", req.Query["item_id"].ToString());
        var result = await client.GetDatabase("eps").GetCollection<BsonDocument>("articlesubmissions").Find(filter).ToListAsync();

        var volume = result.FirstOrDefault()["vol_issue"].ToString().Split('.').First();

        if (allowedIpConfig.Item3 == null || (allowedIpConfig.Item3 != null && !allowedIpConfig.Item3.Contains(volume)))
        {
          var allowedEmailAddresses = await GetAllowedEmailAddresses(log, client);
          var requestEmail = await GetRequestEmail(req);
          if(!IsEmailInAllowedList(requestEmail, allowedEmailAddresses,volume))
          {
            return new BadRequestObjectResult($"Your IP and {requestEmail} is not allowed for this volume");
          }
        }

        fileUrl = result.FirstOrDefault()["fileUrl"].ToString();
      }
      catch (Exception ex)
      {
        log.LogError(ex.ToString());
        throw;
      }

      if (string.IsNullOrWhiteSpace(fileUrl))
      {
        return new NotFoundObjectResult("File Not found");
      }
      // If the IP is allowed, continue processing the request Do your stuff here

      // return a response or call your Logic App, etc.
      return new OkObjectResult(fileUrl);
    }

    private static bool IsEmailInAllowedList(string requestEmail, List<(string, List<string>)> allowedEmailAddresses, string volume)
    {
      var masterListEmails = allowedEmailAddresses.FirstOrDefault((emailEmtry) => emailEmtry.Item1 == "*").Item2;
      if(masterListEmails != null && masterListEmails.Contains(requestEmail))
      {
        return true;
      }

      var emailIdsForTheVolume = allowedEmailAddresses.FirstOrDefault((emailEmtry) => emailEmtry.Item1 == volume).Item2;
      if(emailIdsForTheVolume == null) { return false; }
      return emailIdsForTheVolume.Contains(requestEmail);
    }

    private static async Task<string> GetRequestEmail(HttpRequest req)
    {
      var payload = await GoogleJsonWebSignature.ValidateAsync(req.Headers["AccessToken"].ToString(), new GoogleJsonWebSignature.ValidationSettings()
      {
        Audience = null
      });

      var requestEmail = payload.Email;
      return requestEmail;
    }

    private static async Task<List<(string, List<string>)>> GetAllowedEmailAddresses(ILogger log, MongoClient client)
    {
      var emailIdsDocument = await client.GetDatabase("eps").GetCollection<AllowedEmailAddressesDocument>("AllowedEmailAddresses").Find(Builders<AllowedEmailAddressesDocument>.Filter.Empty).ToListAsync();

      var emailAddresses= emailIdsDocument.FirstOrDefault().AllowList;

      List<(string, List<string>)> allowedEmailIds;
      // Convert to IP ranges
      try
      {
        allowedEmailIds = emailAddresses.Select(x => (x.Volume, x.EmailIds)).ToList();
      }
      catch (Exception e)
      {
        log.LogError(e.ToString());
        throw;
      }

      return allowedEmailIds;
    }

    private static async Task<List<(IPAddress, IPAddress, List<string>)>> GetAllowedIpRanges(ILogger log, MongoClient client)
    {
      var ipRangesDocument = await client.GetDatabase("eps").GetCollection<AllowedIpRangeDocument>("AllowedIpAddresses").Find(Builders<AllowedIpRangeDocument>.Filter.Empty).ToListAsync();

      var ipRanges = ipRangesDocument.FirstOrDefault().AllowList;

      List<(IPAddress, IPAddress, List<string>)> allowedIPRanges;
      // Convert to IP ranges
      try
      {
        allowedIPRanges = ipRanges.Select(x => (IPAddress.Parse(x.IpRangeStart), IPAddress.Parse(x.IpRangeEnd), x.Volumes)).ToList();
      }
      catch (Exception e)
      {
        log.LogError(e.ToString());
        throw;
      }

      return allowedIPRanges;
    }

    public static bool IsIPInAllowedRanges(IPAddress requestIP, List<(IPAddress, IPAddress, List<string>)> allowedIPRanges, out (IPAddress,IPAddress,List<string>) allowedIpConfig )
    {
      var requestIPBytes = requestIP.GetAddressBytes();

      foreach (var range in allowedIPRanges)
      {
        var lowerBytes = range.Item1.GetAddressBytes();
        var upperBytes = range.Item2.GetAddressBytes();

        bool lowerBoundary = true, upperBoundary = true;

        for (int i = 0; i < requestIPBytes.Length && (lowerBoundary || upperBoundary); i++)
        {
          lowerBoundary &= (requestIPBytes[i] >= lowerBytes[i]);
          upperBoundary &= (requestIPBytes[i] <= upperBytes[i]);
        }

        // If the IP is within the range, return true immediately
        if (lowerBoundary && upperBoundary)
        {
          allowedIpConfig = range;
          return true;
        }
      }

      // If none of the ranges included the IP, then return false
      allowedIpConfig = (null,null,null);
      return false;
    }

  }
}

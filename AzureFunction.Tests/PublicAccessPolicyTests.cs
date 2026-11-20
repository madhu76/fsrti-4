using System;
using System.Threading.Tasks;
using JISST.IpAllowlist;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

public class PublicAccessPolicyTests
{
  [Theory]
  [InlineData(null, "1,2")]
  [InlineData("", "1,2")]
  [InlineData("none", "")]
  [InlineData(" 1, 2,3,3,, ", "1,2,3")]
  public async Task PolicyIsAvailableAnonymouslyWithoutDatabaseOrAllowLists(string configured, string expected)
  {
    var previous = Environment.GetEnvironmentVariable("PublicViewVolumes");
    try
    {
      Environment.SetEnvironmentVariable("PublicViewVolumes", configured);
      var context = new DefaultHttpContext();
      context.Request.QueryString = new QueryString("?accessPolicy=true");

      var result = await GetPdfUrl.Run(context.Request, NullLogger.Instance, null);

      var response = Assert.IsType<OkObjectResult>(result);
      var volumes = Assert.IsType<string[]>(response.Value);
      Assert.Equal(expected, string.Join(",", volumes));
    }
    finally
    {
      Environment.SetEnvironmentVariable("PublicViewVolumes", previous);
    }
  }
}

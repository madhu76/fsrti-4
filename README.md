# Eps

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Public, view-only volumes

The Azure Function's `PublicViewVolumes` application setting is a comma-separated
list of volumes that anyone may read without signing in or matching an allowed IP.
It defaults to `1,2` when unset. For example, set it to `1,2,3` to include volume 3,
or `none` to keep all volumes under the existing access rules.
The setting applies to every issue in each listed volume.

The UI reads this same policy from `GetPdfUrl?accessPolicy=true`; it has no separate
volume list to maintain. Articles, contents, and editorials in these volumes show
View instead of Download and open in a PDF viewer with the browser toolbar hidden.
Other volumes retain their existing download and access behavior.
This is a UI restriction, not DRM: browser support for hiding the PDF toolbar varies,
and readers can still save content delivered to their browser.

Deploy the Azure Function before deploying the UI, since the UI needs the policy
endpoint. Changes to the application setting take effect in the UI after a reload.

Run access-policy tests with `dotnet test AzureFunction.Tests`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

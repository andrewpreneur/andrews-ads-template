# Authorization

> All 7 pages of the "Authorization" section of the HighLevel API guides. Every guide page in one file: https://marketplace.gohighlevel.com/docs/llms/guides.txt. Index of all LLM files: https://marketplace.gohighlevel.com/docs/llms.txt

## Contents

- Access Token Generation: Agency vs. Sub-Account Scenarios: https://marketplace.gohighlevel.com/docs/Authorization/AccessTokenUseCase.md
- Authorization: https://marketplace.gohighlevel.com/docs/Authorization/authorization_doc.md
- Developer's Glossary of Terms: https://marketplace.gohighlevel.com/docs/Authorization/DeveloperGlossary.md
- OAuth 2.0: https://marketplace.gohighlevel.com/docs/Authorization/OAuth2.0.md
- Private Integrations: https://marketplace.gohighlevel.com/docs/Authorization/PrivateIntegrationsToken.md
- Handling Access Tokens for Apps with Target User: Agency: https://marketplace.gohighlevel.com/docs/Authorization/TargetUserAgency.md
- Handling Access Tokens for Apps with Target User: Sub-Account: https://marketplace.gohighlevel.com/docs/Authorization/TargetUserSubAccount.md

---

# Access Token Generation: Agency vs. Sub-Account Scenarios

Source: https://marketplace.gohighlevel.com/docs/Authorization/AccessTokenUseCase

The type of Access Token that is generated depends on who is installing the app (an agency or a sub-account) and the app's distribution settings. Understanding these scenarios is crucial for developers to ensure their app correctly authenticates and functions as expected. Below, we'll outline the different contexts that determine whether an Agency-level or Sub-Account (Location-level) Access Token is issued.

---

# Authorization

Source: https://marketplace.gohighlevel.com/docs/Authorization/authorization_doc

Authorization is the process of granting or denying access to resources based on a user's verified identity and permissions. It determines what a user can do within a system after they have been authenticated (proven their identity). Essentially, it's about verifying that a user has the right to access specific resources or perform certain actions.

---

## HighLevel currently supports two types of authorization:

- [Private Integration Token](/Authorization/PrivateIntegrationsToken)
- [OAuth 2.0 Flow](/Authorization/OAuth2.0)

---

### When should I use a Private Integration Token?

You should use a Private Integration Token if:

- Your use case involves accessing our API endpoints for internal purposes.
- If you don't need webhooks or custom design or pages.
- If you need to access only 1 sub-account at a time.

#### Example use cases:

- Internal data synchronization
- Custom reporting dashboards
- Automated tasks within your own system

---

### When should I use OAuth 2.0 Flow?

You should use OAuth 2.0 Flow if:

- You're developing a full-scale integration intended for public use.
- Your integration requires features like webhooks and custom modules.
- You need advanced security features and standardized authorization management.

#### Example use cases:

- Third-party applications
- Creating custom conversation providers/custom workflow actions and triggers, etc.
- Services requiring secure user authorization

---

---

# Developer's Glossary of Terms

Source: https://marketplace.gohighlevel.com/docs/Authorization/DeveloperGlossary

- **Developer's Marketplace:** The Developer's Marketplace is a platform within HighLevel that allows developers to build and integrate their applications and tools using the HighLevel API. [HighLevel Developer Documentation](https://marketplace.gohighlevel.com/docs)

- **API (Application Programming Interface):** An API is a set of rules and protocols that allows different software applications to communicate with each other. In the Developer's Marketplace context, the HighLevel API enables developers to access and interact with HighLevel's features and data.

- **Access Token:** An Access Token is a credential an app uses to access protected resources for a user or account. In the Developer's Marketplace, developers obtain an Access Token through the OAuth process, which allows their app to make authenticated API requests to HighLevel. The Access Token is usually included in the Authorization header of API requests.

- **AppID:** The unique identifier for your marketplace application. You can find it below the app name.

- **Conversation Provider ID:** The unique identifier for the type of provider a user installs. You can find it under the name of the conversation provider if you have created one for your app.

- **Refresh Token:** A Refresh Token is a credential that can be used to obtain a new Access Token without requiring the user to reauthorize the app. It provides a longer-lasting authorization mechanism and helps maintain continuous access to HighLevel resources. When an Access Token expires, the Refresh Token can be used to obtain a new one.

- **OAuth (Open Authorization):** OAuth is an industry-standard protocol that enables secure app authorization and authentication. It allows users to grant permission to apps to access their HighLevel data without sharing their login credentials. OAuth involves an authorization process where users are redirected to HighLevel to authenticate and grant access to the app. [OAuth 2.0 Introduction](https://oauth.net/2/)

- **Redirect URI:** A Redirect URI is the URL that HighLevel will send users after authorizing the app's access. During the OAuth process, users are redirected to the app with an authorization code or access token appended to the Redirect URI after granting permission. [OAuth 2.0 Redirect URI](https://www.oauth.com/oauth2-servers/redirect-uris/)

- **Authorization Code:** In the OAuth process, an Authorization Code is a short-lived credential obtained after a user successfully authorizes an app. The app exchanges this code for an Access Token and Refresh Token. [OAuth 2.0 Authorization Code Grant](https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/)

- **Scopes:** Scopes define the specific permissions and access rights an app requires to interact with HighLevel. When creating an app, developers specify the necessary scopes that align with their app's functionalities. Scopes can include reading, writing, or managing permissions for different resources within HighLevel. Each endpoint's API reference page lists the scopes it requires; see [OAuth 2.0 Scopes](https://oauth.net/2/scope/) for the general concept.

- **Endpoint:** An endpoint is a specific URL or URI representing an API resource or functionality. HighLevel's API exposes various endpoints that developers can access to perform specific actions or retrieve specific data.

- **Status Code:** A status code is a three-digit number returned by the server to indicate the outcome of an HTTP request. Common status codes include 200 (OK), 400 (Bad Request), 401 (Unauthorized), and 422 (Unprocessable Entity). [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

- **Distribution Type:** Distribution Type refers to how an app is distributed or made available to HighLevel users. It can be either Agency or Sub Account. Agency distribution allows the app to be used by all locations within an agency account, while Sub Account distribution limits usage to specific sub-accounts or individual locations.

- **Location ID:** Location ID is a unique identifier assigned to a specific location within a HighLevel account. It is used to differentiate and manage access at the location level.

- **Company ID:** Company ID is a unique identifier assigned to a HighLevel company or account. It helps differentiate and manage access at the company level.

- **Live Server:** Live Server refers to the actual production environment where the app interacts with HighLevel's API and real user data. It is the server where the app is deployed and accessible by users.

- **SDK (Software Development Kit):** An SDK is a set of tools, libraries, and documentation developers use to build applications for a specific platform or framework. HighLevel provides an SDK that facilitates the integration of custom apps with its API.

- **Authorization Header:** The Authorization Header is an HTTP header that includes authentication credentials in API requests, such as an Access Token. It typically takes the form "Authorization: Bearer `Access-Token`". [Understand the Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization)

- **API Key:** An API Key is a unique identifier or code provided to developers granting API access. It serves as a form of authentication when making API requests.

- **Callback URL:** A Callback URL is where an app expects to receive callbacks or responses. In the Developer's Marketplace context, the Callback URL is the endpoint that receives the authorization code or access token after the user grants permission during the OAuth process. [Learn more about Callback URLs](https://oauth.net/2/redirect-uris/)

- **JSON (JavaScript Object Notation):** JSON is a lightweight data-interchange format that is easy for humans to read and write and for machines to parse and generate. It is commonly used for structuring data in API requests and responses. [Introduction to JSON](https://www.json.org/json-en.html)

- **Parameters:** Parameters are additional values included in an API request to provide specific instructions or filter the desired data. Parameters can be used to specify search criteria, sorting preferences, or pagination options. [Understanding API Parameters](https://cloud.google.com/apigee)

- **Pagination:** Pagination is dividing a large data set into smaller, more manageable parts called pages. API responses often include pagination information, such as the number of items per page and the total number of pages, allowing developers to retrieve data incrementally. [Implementing Pagination](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/)

- **Rate Limiting:** Rate Limiting is a mechanism APIs use to restrict client or user's requests within a specific period. It helps maintain API performance and prevent abuse.

- **Webhooks:** Webhooks are HTTP callbacks or notifications sent from one application to another when a specific event or trigger occurs. In the Developer's Marketplace context, developers can configure webhooks to receive real-time updates or data from HighLevel, such as new leads or contact information.

- **Event:** An Event refers to a specific occurrence or action within an application or system. In the context of webhooks, events are triggers that prompt sending a webhook notification.

- **Request:** A request is a communication made by an app to the HighLevel API. It includes the HTTP method (e.g., GET, POST), the URL or endpoint, headers, and required parameters or data. [HTTP Request Methods](https://www.tutorialspoint.com/http/http_methods.htm)

- **Response:** A response is the server's reply to a request made by an app. It contains the requested data, an acknowledgment of the action performed, and an appropriate status code. [HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

- **GET**: GET is an HTTP method to retrieve server data. It is commonly used for fetching resources or information from APIs. [GET method in HTTP](https://www.w3schools.com/tags/ref_httpmethods.asp)

- **POST**: POST is an HTTP method to submit data to a server. It is typically used for creating new resources or sending data to be processed by APIs. [POST method in HTTP](https://www.w3schools.com/tags/ref_httpmethods.asp)

- **PUT**: PUT is an HTTP method to update or replace existing data on a server. It replaces the entire resource with the new data provided in the request. [PUT method in HTTP](https://www.w3schools.com/tags/ref_httpmethods.asp)

- **DELETE**: DELETE is an HTTP method that removes or deletes a resource from a server. It instructs the server to delete the specified resource. [DELETE method in HTTP](https://www.w3schools.com/tags/ref_httpmethods.asp)

- **Front-End Development:** Front-End Development involves building the user-facing components of a software application. It typically includes HTML, CSS, and JavaScript developers to create interactive and visually appealing interfaces.

- **Back-End Development:** Back-End Development focuses on the server-side components of a software application. It involves implementing the logic, data storage, and processing necessary to support the application's functionality.

---

---

# OAuth 2.0

Source: https://marketplace.gohighlevel.com/docs/Authorization/OAuth2.0

OAuth 2.0 is a standard protocol that authorizes a client application (like a third-party app) to access specific resources on behalf of a user, without sharing the user’s password. It’s widely used for APIs that need secure, delegated access.

HighLevel supports the **Authorization Code Grant** flow with v2 APIs. Below is the step-by-step procedure to understand and use the OAuth 2.0 flow.

---

## 1. Register an OAuth App

1. Go to the [Marketplace](https://marketplace.gohighlevel.com/) and sign up for a developer account.
2. Go to My Apps, click Create App.
3. Fill in the following details:
   - **APP Name:** Suitable name for the app.
   - **APP Type:** Private or Public.
     - **Private Apps**: For personal/internal use, not listed in the Marketplace.
     - **Public Apps**: Visible and installable by all users once approved.

     _**Note**: We recommend starting with your app set to Private. This allows you to develop and thoroughly test its functionality in a controlled environment. Once you're confident the app is stable and complete, you can switch it to Public for broader installation and use by other accounts._
   - **Target User**: This allows you to define who your app is intended for — in other words, who will actually be using it.
 For the vast majority of apps (approximately 95%), the ideal choice is `"Sub-account"` (recommended).
   - **Who can install**: Who should be able to view and install the app from the Marketplace UI?
The recommended setting is `“Both Agency & Sub-account”` to ensure maximum visibility and adoption of your app.
However, if you’re building a fully white-labeled SaaS feature intended to be exclusively discovered and installed by agencies for use within their sub-accounts, you may choose to limit visibility to Agencies only.
   - **Listing Type:** White-label recommended for marketing agencies.

[image: drawing]

4. After creating the APP you will be taken to the Profile section where you will need to add the details related to your APP. For eg; APP Logo, category, Company Name, APP Description, preview images etc.
5. After completing the profile details, please click on the Advanced Settings drop down available in the left pane and go to the auth section.
6. The Auth page will appear as shown in the screenshot below. This is where you’ll configure essential settings for your app’s OAuth integration, including scopes, redirect URLs, and client credentials.

[image: drawing]

   - **Scopes:** Scopes define the level of access your app will have — what data it can read or what actions it can perform on behalf of the user. Each endpoint's API reference page lists the scopes it requires.
        - It’s best practice to request the minimum number of scopes necessary for your app to function.
        - Click on the "Select Scope" dropdown and choose the relevant scopes based on your app’s functionality.

   - **Redirect URL:** A Redirect URL (also known as a Callback URL) is the destination where the authorization server will send the authorization code after the user installs the app.
        - Enter your redirect URL in the Redirect URL field.
        - Click the "Add" button to save it.

   - **Client Keys (ID & Secret):** In the Client Keys section:
        - Click the "Add" button.
        - Provide a name for your client key pair.
        - Upon saving, your Client ID and Client Secret will be generated.

    These credentials are used to identify and authenticate your application with the OAuth server during token exchange.

    **Important:** Be sure to copy and securely store your Client Secret immediately. After clicking "OK", you will not be able to view or copy the secret again from the UI.

---

## 2. Add the App to Your Desired Location

- Have the location/agency admin visit your Installation URL.
- Select the location to connect.
- Redirected to your Redirect URL with an Authorization Code.
- Exchange the code for an Access Token via the OAuth 2.0 [Get Access Token](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-access-token) API.
- Use the Access Token to call APIs.

---

## 3. Get the Installation URL

Inside your APP Auth Pane available inside the Advanced Settings Section you will be able to see the Install Link at the top of the Page.

[image: drawing]

Click on the Show button and you will be able to see the Installation URLs which you will be using to install the APP.

[image: drawing]

Depending on your usecase and account setup you can either use the standard or the whitelabel version of the Installation URL.

Refer to the below steps to install the APP:

1. Copy the Installation URL and open it in your browser.
2. In case you are not logged in to your GHL account it will ask you to login to your account.

[image: drawing]

        - In case you are logged in it will show a page showcasing the accounts.

[image: drawing]

3. Select the account you want to install the APP in.
4. When a user grants access, their browser is redirected to the specified redirect URI, and the Authorization Code is passed inside the code query parameter.

```json

https://myapp.com/oauth/callback/highlevel?code=7676cjcbdc6t76cdcbkjcd09821jknnkj

```

This URL demonstrates a typical OAuth callback scenario for a HighLevel integration. The `code` parameter included in the query string is essential for completing the authorization flow.

---

## 4. Listening to Webhook Events

The HighLevel Marketplace App allows you to listen to various webhook events, enabling real-time updates and integrations based on user actions.

To set up webhook listeners:

1. Navigate to your app in the Marketplace dashboard.
2. Click on the "Advanced Settings" dropdown in the left-hand panel.
3. Go to the "Webhooks" section.
4. In the input box at the top, enter your webhook URL.
5. Use the toggle switches next to each event to subscribe to the events you wish to listen for.

For a full list of supported webhook events and example payloads, please refer to the documentation: [Webhook Events & Payloads](https://marketplace.gohighlevel.com/docs/category/webhook)

### Important: App Install Webhook

One of the most critical webhook events is the App Install event. This event provides essential details whenever your app is installed by a user. If a webhook URL is configured for your app, this event is subscribed to by default.

Here’s a sample payload for the App Install event:

```json
{
  "type": "INSTALL",
  "appId": "665c6bb13d4e5364bdec0e2f",
  "versionId": "665c6bb13d4e5364bdec0e2f",
  "installType": "Location",
  "locationId": "HjiMUOsCCHCjtxzEf8PR",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "userId": "Rg6BRRiHh7dS9gJy3W8a",
  "companyName": "Marketplace and Integrations Prod Agency",
  "isWhitelabelCompany": true,
  "whitelabelDetails": {
    "logoUrl": "https://...gif",
    "domain": "rajender.dentistsnear.me"
  },
  "timestamp": "2025-06-25T06:57:06.225Z",
  "webhookId": "1a533f85-1f1e-4886-891e-ee0cf4666e90"
}
```

---

## 5. Exchange Authorization Code for Access Token

Once you have received the Authorization code on your redirect URl you are expected to use [Get Access Token API](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-access-token) endpoint to generate the Acces Token which you can then use to run the API endpoints.

Sample Payload:

```bash
curl -X POST "https://services.leadconnectorhq.com/oauth/token" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "665c6bb13d4e5364bdec0e2f-mawqjyjd",
    "client_secret": "74032272-7f45-4e07-8717-5e1ddbfe3de0",
    "grant_type": "authorization_code",
    "code": "363fe3f086e2db02bb9c34722902d21f76c9b217",
    "user_type": "Company",
    "redirect_uri": "https://myapp.com/oauth/callback/highlevel"
  }'
```

Sample Response:

```json

{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb20",
  "token_type": "Bearer",
  "expires_in": 86399,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb21w",
  "scope": "calendars.readonly calendars/events.readonly calendars.write calendars/events.write calendars/groups.readonly calendars/groups.write calendars/resources.readonly calendars/resources.write",
  "refreshTokenId": "685a9cc9f7434ae2fc66c31d",
  "userType": "Company",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "isBulkInstallation": true,
  "userId": "Rg6BRRiHh7dS9gJy3W8a"
}

```

---

## 6. Refresh Token Usage

As shown in the previous response, the Access Token expires after 86,399 seconds, which is approximately 24 hours. This means you'll need to regenerate a new Access Token once it expires to continue making API requests.

However, regenerating an Access Token using the authorization code requires repeating the entire installation process, which can be time-consuming. To simplify this, we also provide a Refresh Token along with the Access Token.

The Refresh Token is valid for up to one year, or until it is used. Once you use a Refresh Token to obtain a new Access Token, the original Refresh Token becomes invalid, and the response will include a new Refresh Token along with the new Access Token.
 If left unused, the Refresh Token will remain valid for one year.

To generate a new Access Token using your existing Refresh Token, use the following API endpoint: [Get Access Token](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-access-token)

- Access Tokens expire after ~24 hours.
- Refresh Tokens are valid for 1 year or until used.
- Use Refresh Token to obtain a new Access Token without reinstallation.

Sample Payload:

```bash
curl --request POST \
  --url https://services.leadconnectorhq.com/oauth/token \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data client_id=665c6bb13d4e5364bdece2f-mawqjyjd \
  --data client_secret=74032272-7f45-4e7-8717-5e1ddbfe3de0 \
  --data grant_type=refresh_token \
  --data refresh_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.dCiY5HiwOaxk8Cz6pQ0KstyeRu5fhPo \
  --data user_type=Company \
  --data redirect_uri=https://myapp.com/oauth/callback/highlevel
```

Sample Response:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb21QU_Dcpo6oL_t8NN350g",
  "token_type": "Bearer",
  "expires_in": 86399,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.sDO9cDrBHKShX173dwDZyxh4a6U",
  "scope": "businesses.readonly businesses.write companies.readonly calendars.readonly calendars/events.readonly calendars.write calendars/events.write calendars/groups.readonly calendars/groups.write calendars/resources.readonly calendars/resources.write",
  "refreshTokenId": "685b558f21fa7b18e3d09a",
  "userType": "Company",
  "companyId": "GNb7aIvrQFVb9wNl5K",
  "isBulkInstallation": true,
  "userId": "Rg6BRRih7dS9gJ3W8a"
}

```

---

## 7. Types of Access Token

In HighLevel we have 2 types of Access Token depending on the type of APP you have installed and who has installed the APP.

1. **Access Token with User Type as Agency:** This Type of Access Token will be utilized to run the APIs related to the Agency Functionalities. For eg; [Create Sub-Account API.](https://marketplace.gohighlevel.com/docs/ghl/locations/create-location/index.html)

Sample Response:

```json

{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb21QU_Dcpo6oL_t8NN350g",
  "token_type": "Bearer",
  "expires_in": 86399,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.sDO9cDrBHKShX173dwDZyxh4a6U",
  "scope": "businesses.readonly businesses.write companies.readonly calendars.readonly calendars/events.readonly calendars.write calendars/events.write calendars/groups.readonly calendars/groups.write calendars/resources.readonly calendars/resources.write",
  "refreshTokenId": "685ba558f21fa7b18e3d09a",
  "userType": "Company",
  "companyId": "GNb7aIv4rQFVb9wNl5K",
  "isBulkInstallation": true,
  "userId": "Rg6BRRiHh7dS9gJ3W8a"
}

```

2. **Access Token with User Type as Location:** This Type of Access Token will be utilized to run the APIs related to the Sub-Account or Location Functionalities. For eg; [Create Contact API.](https://marketplace.gohighlevel.com/docs/ghl/contacts/create-contact)

Sample Response:

```json

{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ODViZDRiNW",
  "token_type": "Bearer",
  "expires_in": 86400,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3",
  "scope": "calendars.readonly calendars/events.readonly calendars.write calendars/events.write calendars/groups.readonly calendars/groups.write calendars/resources.readonly calendars/resources.write",
  "userType": "Location",
  "companyId": "GNb7aIv4rQFVb9iNl5K",
  "locationId": "HjiMUOsCCHCjtxEf8PR",
  "userId": "Rg6BRRiHh7dS9gy3W8a",
  "traceId": "8f712294-b015-42a-8c69-7fcb960560aa"
}

```

---

## 8. Create Sub-Account Token from Agency Token

Suppose you have an Agency-level Access Token but want to run API endpoints specific to a Sub-Account (Location). In that case, you can use the Agency-level Access Token to generate a Sub-Account/Location-level Access Token via the [Get Location Access Token from Agency Token](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-location-access-token) API endpoint.

Sample Payload:

```bash
curl -L "https://services.leadconnectorhq.com/oauth/locationToken" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Version: 2021-07-28" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJD" \
  -d '{
    "companyId": "GNb7aIv4rQFV9iwNl5K",
    "locationId": "HjiMUOsCCHCjtxEf8PR"
  }'
```

Sample Response:

```json

{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ODViZDRiNW",
  "token_type": "Bearer",
  "expires_in": 86400,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3",
  "scope": "calendars.readonly calendars/events.readonly calendars.write calendars/events.write calendars/groups.readonly calendars/groups.write calendars/resources.readonly calendars/resources.write",
  "userType": "Location",
  "companyId": "GNb7aIv4rQFVb9iNl5K",
  "locationId": "HjiMUOsCCHCjtxEf8PR",
  "userId": "Rg6BRRiHh7dS9gy3W8a",
  "traceId": "8f712294-b015-42a-8c69-7fcb960560aa"
} 

```

---

# Private Integrations

Source: https://marketplace.gohighlevel.com/docs/Authorization/PrivateIntegrationsToken

Private Integrations allow you to build powerful custom integrations between your HighLevel account and any other third-party app.

If you are looking to integrate your HighLevel account with a third-party app, you have two options:

1. Find and install the relevant app from the App Marketplace
2. Build your own private integration by yourself or with the help of a developer using APIs.

Private Integrations help you achieve #2 securely.

[Video Walkthrough](https://youtu.be/ssDO6tz6b1w)

## Key Advantages of Private Integrations

- **Simple:** Generate Private Integration tokens from your account settings and manage them with ease.
- **Secure:** You get to restrict the scopes/permissions that a developer can access on your account.

Private Integrations are available for both Agencies and Sub-Accounts.

---

## What's the difference between Private Integrations and API Keys?

| Private Integrations | API Keys |
|----------------------|----------|
| More Secure: You get to restrict the scopes/permissions that a developer can access on your account | Less Secure: A developer gets unrestricted access to all your account data |
| State-of-art: Private Integrations allows you to access API v2.0 which is state of the art | Out-dated: API Keys work on API v1.0 which has reached end-of-life and is no longer maintained |
| More Features: API v2.0 has more powerful APIs | Less Features: API v1.0 has limited APIs |

---

## What's the difference between Private Integrations and OAuth2 Access Tokens?

Private Integrations, to put it simply, are static/fixed OAuth2 Access Tokens.

| Private Integrations | Access Tokens |
|----------------------|--------------|
| Generated from the UI: Private Integration token can be generated easily from the UI | Programmatic Generation: API Tokens are generated by exchanging OAuth access code for the tokens using Get Access Token API |
| Static/Fixed: Private Integration Tokens are static/fixed and do not automatically refresh unless you rotate them from the UI | Refreshed Daily: Access Tokens expire daily and need to be refreshed |

---

## How do I use Private Integrations?

Private Integration tokens are used in the Authorization header, just like other Access Tokens.

**Example:**

```bash
curl --request GET \
  --url https://services.leadconnectorhq.com/locations/ve9EPM428h8vShlRW1KT \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer <YOUR PRIVATE INTEGRATION TOKEN>' \
  --header 'Version: 2021-07-28'
```

---

## Testing a Private Integration with API Calls

Once your Private Integration is created, you may want to test it by pushing data to an API endpoint. Here’s an example of how to test the integration by adding a new contact:

```bash
curl --request POST \
  --url https://services.leadconnectorhq.com/contacts/ \
  --header 'Authorization: Bearer <YOUR PRIVATE INTEGRATION TOKEN>' \
  --header 'Content-Type: application/json' \
  --header 'Version: 2021-07-28' \
  --data '{ "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "phone": "+1234567890", "locationId": "LOCATION_ID" }'
```

**Make sure to:**
- Replace `LOCATION_ID` with the actual sub-account ID.
- Replace `Authorization` value with your generated Private Integration token.

For a full list of available endpoints and testing capabilities, visit [our official developer documentation](https://developers.gohighlevel.com).

---

## How do I manage Private Integrations?

### Who can create Private Integrations?

By default, all agency admins can create and manage Private Integrations. You can restrict this permission at a user level.

Navigate to:
**Settings > Team > Edit the specific agency admin > Roles & Permissions**, and enable/disable Private Integrations for the agency admin.

You may apply restrictions at two levels:
- Allow the agency admin to view and manage the agency's private integrations
- Allow the agency admin to view and manage the sub-accounts' private integrations

---

### Where can I find Private Integrations?

You can find Private Integrations under agency settings.
If you don't find it under settings, please make sure that you have enabled the feature on Labs.

---

## How do I create a new Private Integration?

**Step 1:** Click on "Create new Integration"
**Step 2:** Give your Private Integration a name and description to help you and your team identify what it's for.
**Step 3:** Select the scopes/permissions that you want the private integration to have access to on your agency account. Ensure that you are selecting only the required scopes for better data security.
**Step 4:** Copy the token generated and share it with your third-party app developer.

> **Note:** Please ensure that you are sharing the token with trusted parties only. Do not share it publicly.
> Don't forget to copy the token generated as you won't be able to do it again later.

---

## Best Practices to Maintain Security of My Private Integration Token

We recommend that you rotate your Private Integration tokens every 90 days.

### How to rotate your token:

**Step 1:** Navigate to Private Integrations under settings, and click on the Private Integration you have created.
**Step 2:** Click on "Rotate and expire this token later".
**Step 3:** Click "Continue" in response to the warning message if you are sure that you want to proceed with rotation.
**Step 4:** Copy the new token and update it on your third-party app.

You will have a 7-day window where both the old and the new tokens will continue to work. After 7 days, the old token will expire.

During this window, you can:
- "Cancel rotation" if your developer needs more time.
- "Expire Now" if the third party app has been updated.

---

## What if my token has been compromised?

**Step 1:** Navigate to Private Integrations under settings, and click on the Private Integration you have created.
**Step 2:** Click on "Rotate and expire this token now".
**Step 3:** Click "Continue" in response to the warning message if you are sure that you want to proceed with rotation.
**Step 4:** Copy the new token and update it on your third-party app.

> **Note:** Don't forget to copy the token generated as you won't be able to do it again later.

---

## Can I edit the Private Integration permissions without updating the token?

Yes, you can edit the Private Integration name, description and scopes/permissions any time after you've created it.

**How:**
1. Navigate to Private Integrations under settings, and select "Edit" from the three-dot menu.
2. Update the Private Integration name and description if required. Click on "Next".
3. If required, update the scopes/permissions that you want the private integration to have access to on your account. Ensure that you are selecting only the required scopes for better data security. Click on "Update" to save the updates made.

> **Note:** Updating the Private Integration details does not generate a new token. The existing token will continue to work.

---

## How do I delete the Private Integration once I no longer need it?

You can delete the Private Integration once you are no longer using the third-party app.

To do so, navigate to Private Integrations under settings, and select "Delete" from the three-dot menu.

---

---

# Handling Access Tokens for Apps with Target User: Agency

Source: https://marketplace.gohighlevel.com/docs/Authorization/TargetUserAgency

This guide explains how the installation flow works for the Agency targeted APPs , how to obtain the access token.

## Overview
For apps whose Target User is set as Agency, the app will only be visible to the Agency Admin/Owner, and only they can install it.

---

## Installation Flow

1. Install the app on your Agency account.
2. After installation, the redirect URL will be triggered from our end, and the authorization code will be shared.
3. Use this authorization code to exchange for an Access Token using the [Get Access Token](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-access-token) API endpoint.

- **Note:** The Access Token generated will be of user type company(Agency Level Token).

#### Sample Request

```bash
curl -X POST   https://services.leadconnectorhq.com/oauth/token  
-H 'Accept: application/json'   
-H 'Content-Type: application/x-www-form-urlencoded'   
-d 'client_id=68a2fd84fab6670f45220ebf-megyp358'   
-d 'client_secret=673011da-b03a-4768-bbff-0f45821cd6fe'   
-d 'grant_type=authorization_code'   
-d 'code=16d0b6ceb51350ba437870074ad25bc65e8c1d8d'   
-d 'user_type=Company'

```

#### Sample Response

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb21wYW55IiwiYXV0aENsYQ",
  "token_type": "Bearer",
  "expires_in": 86399,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJDb21wYW55IiwiYXV0aEN",
  "scope": "locations.write",
  "refreshTokenId": "68a2feef89153fe9b8d196bc",
  "userType": "Company",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "isBulkInstallation": false,
  "userId": "Rg6BRRiHh7dS9gJy3W8a"
}
```

---

---

# Handling Access Tokens for Apps with Target User: Sub-Account

Source: https://marketplace.gohighlevel.com/docs/Authorization/TargetUserSubAccount

This document explains how to manage Access Tokens when your app’s Target User is set to Sub-Account.

---

## Installation Options

When you set the target user to Sub-Account during app creation, you can configure who can install the app. The type of token generated depends on the option chosen and who installs the app.

## Who can install the APP: **Agency Only**
- The app will be visible only to Agency Admins/Owners.
- Only Agency Admin/Owner can install the app.

#### Installation Flow
1. Install the app on your account.
2. After installation, the redirect URL will be triggered and an authorization code will be shared.
3. Use this code to exchange for an Access Token via the [Get Access Token](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-access-token) API.

⚠️ **Note:** The Access Token generated here will be of type `Company` (Agency-level).

#### Sample Request
```bash
curl --request POST   
--url https://services.leadconnectorhq.com/oauth/token   
--header 'Accept: application/json'   
--header 'Content-Type: application/x-www-form-urlencoded'   
--data-urlencode client_id=68a32958b5154ca8bbdc4d40-meh5chaj   
--data-urlencode client_secret=a5949eb7-4d46-4bfd-95c1-e338d4952e6b   
--data-urlencode grant_type=authorization_code   
--data-urlencode code=059ff0439402599b0ecb45388a9d4b9fc2d17123   
--data-urlencode user_type=Company   
```

#### Sample Response
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86399,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scope": "businesses.readonly",
  "refreshTokenId": "68a32a7fb5154c26d5dd218c",
  "userType": "Company",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "isBulkInstallation": true,
  "userId": "Rg6BRRiHh7dS9gJy3W8a"
}
```
4. To access Sub-Account–specific API endpoints, the Agency-level Access Token must first be exchanged for a Sub-Account (Location-level) Access Token. This exchange can be performed using the [Get Location Access Token from Agency Token](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-location-access-token) API.

> **Note:** You can configure a webhook URL for your app, and the **App Install event** will automatically be subscribed by default.
>
> When the APP is installed this event will be triggered, this webhook provides details such as the `locationId` where the app has been installed. You can use the `locationId` along with your Agency-level Access Token to exchange it for a Sub-Account (Location-level) Access Token.

#### Sample App Install Event Payload

```json
{
  "type": "INSTALL",
  "appId": "665c6bb13d4e5364bdec0e2f",
  "versionId": "665c6bb13d4e5364bdec0e2f",
  "installType": "Location",
  "locationId": "HjiMUOsCCHCjtxzEf8PR",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "userId": "Rg6BRRiHh7dS9gJy3W8a",
  "companyName": "Marketplace and Integrations Prod Agency",
  "isWhitelabelCompany": true,
  "whitelabelDetails": {
    "logoUrl": "https://...gif",
    "domain": "rajender.dentistsnear.me"
  },
  "timestamp": "2025-06-25T06:57:06.225Z",
  "webhookId": "1a533f85-1f1e-4886-891e-ee0cf4666e90"
}
```

#### Sample Request for Get Location Access Token from Agency Token

```bash
curl -L 'https://services.leadconnectorhq.com/oauth/locationToken'   
-H 'Content-Type: application/x-www-form-urlencoded'   
-H 'Accept: application/json'   
-H 'Version: 2021-07-28'   
-H 'Authorization: Bearer {AGENCY_ACCESS_TOKEN}'   
-d 'companyId=GNb7aIv4rQFVb9iwNl5K'   
-d 'locationId=HjiMUOsCCHCjtxzEf8PR'
```

#### Sample Response

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OGEzMmRhNjlkN2EzY2E5NT",
  "token_type": "Bearer",
  "expires_in": 86400,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJMb2NhdGlvbiIsImF",
  "scope": "businesses.readonly oauth.write oauth.readonly",
  "userType": "Location",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "locationId": "HjiMUOsCCHCjtxzEf8PR",
  "userId": "Rg6BRRiHh7dS9gJy3W8a",
  "traceId": "8cf33664-9f4f-4392-adf6-71b8bed2592a"
}
```

---

## Who can install the APP: **Everyone**

This type of app can be installed by both Agency users and Sub-Account users. The type of Access Token generated will depend on who performs the installation.

### Scenario 1: Agency User installs the app

In this case, the Access Token generated will be of type Company (Agency-level). To access Sub-Account resources, you must exchange this token for a Location-level token using the [Get Location Access Token from Agency Token](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-location-access-token) API endpoint.

#### Installation Flow
1. Install the app on your account.
2. After installation, the redirect URL will be triggered and an authorization code will be shared.
3. Use this code to exchange for an Access Token via the [Get Access Token](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-access-token) API.

⚠️ **Note:** The Access Token generated here will be of type `Company` (Agency-level).

#### Sample Request
```bash
curl --request POST   
--url https://services.leadconnectorhq.com/oauth/token   
--header 'Accept: application/json'   
--header 'Content-Type: application/x-www-form-urlencoded'   
--data-urlencode client_id=68a32958b5154ca8bbdc4d40-meh5chaj   
--data-urlencode client_secret=a5949eb7-4d46-4bfd-95c1-e338d4952e6b   
--data-urlencode grant_type=authorization_code   
--data-urlencode code=059ff0439402599b0ecb45388a9d4b9fc2d17123   
--data-urlencode user_type=Company   
```

#### Sample Response
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86399,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scope": "businesses.readonly",
  "refreshTokenId": "68a32a7fb5154c26d5dd218c",
  "userType": "Company",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "isBulkInstallation": true,
  "userId": "Rg6BRRiHh7dS9gJy3W8a"
}
```
4. To access Sub-Account–specific API endpoints, the Agency-level Access Token must first be exchanged for a Sub-Account (Location-level) Access Token. This exchange can be performed using the [Get Location Access Token from Agency Token](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-location-access-token) API.

> **Note:** You can configure a webhook URL for your app, and the **App Install event** will automatically be subscribed by default.
>
> When the APP is installed this event will be triggered, this webhook provides details such as the `locationId` where the app has been installed. You can use the `locationId` along with your Agency-level Access Token to exchange it for a Sub-Account (Location-level) Access Token.

#### Sample App Install Event Payload

```json
{
  "type": "INSTALL",
  "appId": "665c6bb13d4e5364bdec0e2f",
  "versionId": "665c6bb13d4e5364bdec0e2f",
  "installType": "Location",
  "locationId": "HjiMUOsCCHCjtxzEf8PR",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "userId": "Rg6BRRiHh7dS9gJy3W8a",
  "companyName": "Marketplace and Integrations Prod Agency",
  "isWhitelabelCompany": true,
  "whitelabelDetails": {
    "logoUrl": "https://...gif",
    "domain": "rajender.dentistsnear.me"
  },
  "timestamp": "2025-06-25T06:57:06.225Z",
  "webhookId": "1a533f85-1f1e-4886-891e-ee0cf4666e90"
}
```

#### Sample Request for Get Location Access Token from Agency Token

```bash
curl -L 'https://services.leadconnectorhq.com/oauth/locationToken'   
-H 'Content-Type: application/x-www-form-urlencoded'   
-H 'Accept: application/json'   
-H 'Version: 2021-07-28'   
-H 'Authorization: Bearer {AGENCY_ACCESS_TOKEN}'   
-d 'companyId=GNb7aIv4rQFVb9iwNl5K'   
-d 'locationId=HjiMUOsCCHCjtxzEf8PR'
```

#### Sample Response

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OGEzMmRhNjlkN2EzY2E5NT",
  "token_type": "Bearer",
  "expires_in": 86400,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJMb2NhdGlvbiIsImF",
  "scope": "businesses.readonly oauth.write oauth.readonly",
  "userType": "Location",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "locationId": "HjiMUOsCCHCjtxzEf8PR",
  "userId": "Rg6BRRiHh7dS9gJy3W8a",
  "traceId": "8cf33664-9f4f-4392-adf6-71b8bed2592a"
}
```

### Scenario 2: Sub-Account User installs the app

In this case, the Access Token generated will be of type Location (Sub-Account level).

#### Installation Flow
1. Install the app on your account.
2. After installation, the redirect URL will be triggered and an authorization code will be shared.
3. Use this code to exchange for an Access Token via the [Get Access Token](https://marketplace.gohighlevel.com/docs/ghl/oauth/get-access-token) API.

#### Sample Request

```bash
curl --request POST \
  --url https://services.leadconnectorhq.com/oauth/token \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode client_id=68a42f3c2a64bb65c985c618-mei99elp \
  --data-urlencode client_secret=86f9901c-b57d-4395-a406-ff178cd8a57d \
  --data-urlencode grant_type=authorization_code \
  --data-urlencode code=4a1a74401abd1b46d923543c4a366eb3f21b5cbf \
  --data-urlencode user_type=Location 
```

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJMb2NhdGlvbiIsImF1dGhDbGFzc0lkIjoiSGppTVVPc0NDSENqdHh6RWY4UFIiLCJzb3VyY2UiOiJJTl",
  "token_type": "Bearer",
  "expires_in": 86399,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJMb2N",
  "scope": "businesses.readonly",
  "refreshTokenId": "68a4332c2a64bbc7a1888971",
  "userType": "Location",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "locationId": "HjiMUOsCCHCjtxzEf8PR",
  "isBulkInstallation": false,
  "userId": "57n5nmVqHA1ghBM8UKhU"
}
```

---

## Summary
- **Agency-only installation:** If “Who can install the app” is set to Agency only, the generated token will be of type `Company` (Agency-level). To run APIs and perform actions at the Sub-Account level, this token must be exchanged for a Location-level token.
- **Everyone installation:**  If “Who can install the app” is set to Everyone, there are two possible scenarios:
  - **Agency User Installs the APP** → The generated token will be of type `Company` (Agency-level). To run APIs and perform actions at the Sub-Account level, this token must be exchanged for a Location-level token.
  - **Sub-Account User Installs the APP** → The generated token will be of type `Location`. This token can be used directly to call APIs and perform tasks without further exchange.

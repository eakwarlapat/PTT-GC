export const ResourceMap:
[string, string[]][] = [
  ['http://localhost:4200/initiative/my-tasks',
  ['api://1e122742-e83f-4c02-abd1-a485b305bdf2/api-access']],
  ['https://graph.microsoft.com/v1.0/me', ['user.read']],
];

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export const MsalSetting = {
  clientID: '1e122742-e83f-4c02-abd1-a485b305bdf2',
  authority: 'https://login.microsoftonline.com/3ab205fa-5c1e-476b-8472-e9f22e3638ed/',
   // 'https://login.microsoftonline.com/3ab205fa-5c1e-476b-8472-e9f22e3638ed/',
  validateAuthority: true,
  redirectUri: 'http://localhost:4200/',
  cacheLocation: 'localStorage',
  postLogoutRedirectUri: 'http://localhost:4200/',
  navigateToLoginRequestUrl: true,
  popUp: true,
  storeAuthStateInCookie: isIE,
  consentScopes: ['user.read', 'api://1e122742-e83f-4c02-abd1-a485b305bdf2/api-access'],
  unprotectedResources: ['https://www.microsoft.com/en-us/'],
  protectedResourceMap: ResourceMap
};

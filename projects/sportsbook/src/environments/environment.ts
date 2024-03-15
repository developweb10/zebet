// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  title : 'ZEbet',
  Domain : 'http://dev.zebet.link/',
  BASE_URL: 'https://cms.zebet.ng/items/',
  Log_In_API : 'https://it40d0oae9.execute-api.us-east-1.amazonaws.com/dev/api/user/sign-in',
  Resigter_API:'https://it40d0oae9.execute-api.us-east-1.amazonaws.com/dev/api/user/sign-up',
  Sign_Out_API:'https://it40d0oae9.execute-api.us-east-1.amazonaws.com/dev/api/user/sign-out',
  Forget_Password:'https://it40d0oae9.execute-api.us-east-1.amazonaws.com/dev/api/user/reset-password',
  Send_OTP:'https://it40d0oae9.execute-api.us-east-1.amazonaws.com/dev/api/user/send-otp',
  Verify_OTP:'https://it40d0oae9.execute-api.us-east-1.amazonaws.com/dev/api/user/verify-otp',
  BetSlipUrl:'https://wvmsrsz1m7.execute-api.us-east-1.amazonaws.com/dev/api/betslip',
  EFFECTIVE_DATE: '2019-06-30',
  isLiveFeedConnected: true,
  dataExpiry: 24,
  ASSETS_URL: 'https://cms.zebet.ng/',
  swaggerApi : 'https://sportsbook.uat.zebet.link/',
  paymentUrl : 'https://tripay.uat.zebet.link/3pay/pub/v1/',
  websiteUrl : "dgp-zbet",
  liveDocLocal : '/',
  AES_ALGORITHM : 'aes-256-cbc',
  betWinUrl: 'https://it40d0oae9.execute-api.us-east-1.amazonaws.com/dev/',
  redirect_url: "http://qa.zebet.link/",
  kycSmildIdUrl: "https://api.smileidentity.com/",
  kycSmileIdPartnerId: '1376',
  smileIdApikey: "74fc5a64-f4f1-4339-961f-86ba9297acaf",
  eventSize: 30,
  cmsDEVToken: "j1vSU2qyJQ1_BBql5Ja8-lDD1khtvYeL",
  cmsPRODToken: "PtV5nXrapQ9kppYr3Mwf-5wNju8hZVO6",
  cmsQAToken: "3DyO_3YhT8wcGp3mCyebP0Fs3S3oT-V-",
  cmsUATToken: "C798TL4m1OMGLJxjZmWFseX9Hf9670tl",
  cmsBaseUrl: "https://cms.zebet.ng",
  iamge_URL:"https://cms.zebet.ng/",
  permanent_exclusion: 50,
  encryption_key: "0b05407c9a00i07044416bad7a51bacg282fc5c0f999561a4tf15c342b268b30",
  openBetUrl: "https://it40d0oae9.execute-api.us-east-1.amazonaws.com/dev/api/user/open-bets",
  REFRESH_TOKEN_URL: "https://it40d0oae9.execute-api.us-east-1.amazonaws.com/dev/api/user/refresh-token",
  URL_LINK : 'http://qa.zebet.link/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

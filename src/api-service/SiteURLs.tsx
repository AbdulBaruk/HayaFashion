import configJson from '../config/config';

const siteUrlsJson = {
  ourSiteUrls: {
    auth: {
     signIn:'user_login',
     userCreate:'create_users',
     users:'users'
    },
    products: {
        categories: 'api/categories/',
        product:'api/products',
    },
  },
  outerDomainUrls: {},
};
function checkInnerJson(jsonData: any) {
  if (jsonData) {
    for (const key in jsonData) {
      if (typeof jsonData[key] === 'string') {
        jsonData[key] = `${configJson.backendDomain}${jsonData[key]}`;
      } else {
        jsonData[key] = checkInnerJson(jsonData[key]);
      }
    }
  }
  return jsonData as typeof siteUrlsJson.ourSiteUrls;
}

const siteUrls = {
  ...checkInnerJson(siteUrlsJson.ourSiteUrls),
  outerDomainUrls: siteUrlsJson.outerDomainUrls,
};
export default siteUrls;

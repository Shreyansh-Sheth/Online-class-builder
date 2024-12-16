const hostedDomain = process.env.FRONTEND_DOMAIN_HOST ?? "lacolhost.com:3000";
const storeDomain = process.env.STORE_DOMAIN_HOST ?? hostedDomain;
const DomainSettings = {
  domain: hostedDomain,
  subdomainSiteBaseURL: "." + storeDomain,
};
export default DomainSettings;

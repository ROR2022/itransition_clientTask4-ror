
const nodeEnv = process.env.NODE_ENV;
export const hostURL =
  nodeEnv === "development"
    ? process.env.NEXT_PUBLIC_DEV_ENV
    : process.env.NEXT_PUBLIC_PRD_ENV;

export const LOCALSTORAGE_KEY = "userItransitionTask4";

export const dataAvatares = [
  {
    title: "Avatar 1",
    url: "/avatar1.png",
  },
  {
    title: "Avatar 2",
    url: "/avatar2.png",
  },
  {
    title: "Avatar 3",
    url: "/avatar3.png",
  },
  {
    title: "Avatar 4",
    url: "/avatar4.png",
  },
];

export const userLinks = [
  {
    title: "face",
    url: "https://www.facebook.com/profile.php?id=100093387276573&sk=photos",
  },
  { title: "insta", url: "https://www.instagram.com/pediatria_martha_ocampo/" },
  { title: "ubi", url: "https://maps.app.goo.gl/CHATNnQ6ASMH8R2X9" },
];


export const userSettingsLinks = [
  {
    title: "Linkedin",
    url: "https://www.linkedin.com/in/ramiro-ocampo-5a661b1a7/",
  },
  {
    title: "Github",
    url: "https://github.com/ROR2022",
  },
  { 
    title: "HackerRank", 
    url: "https://www.hackerrank.com/profile/rami_ror279" 
  },
  {
    title: "CV_ROR",
    url: "https://docs.google.com/document/d/104ek8dOTdOU6RcDMtGT-g1T--FWxq2earIDvMZoQ79E/edit?usp=sharing"
  },
  {
    title: "Portfolio",
    url: "https://ror-portfolio.vercel.app/"
  }
];


export const mainNavbarLongText = 'iTransition Internship - ROR';
export const mainNavbarShortText = 'iTransition-ROR';

export const phoneUser = '7777937484';
export const mainLogoUser = '/rorProfile1.jpg';
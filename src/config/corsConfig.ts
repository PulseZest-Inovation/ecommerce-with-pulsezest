export const allowedOrigins = [
    "https://ecommerce-with-pulsezest.vercel.app",
    "https://apnimaativastram.com/",
    "http://localhost:3000/",
    "http://localhost:3001/",
  ];
  
  export const setCorsHeaders = (req: any, res: any) => {
    const origin = req.headers.origin;
  
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  };
  
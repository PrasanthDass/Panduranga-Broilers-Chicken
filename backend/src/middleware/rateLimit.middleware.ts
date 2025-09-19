import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // login requests
  message: "Too many login attempts from this IP, please try again later.",
});

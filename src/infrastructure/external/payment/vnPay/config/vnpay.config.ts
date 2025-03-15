export default () => ({
  vnpay: {
    tmnCode: process.env.VNPAY_TMNCODE,
    hashSecret: process.env.VNPAY_HASHHASHSECRET,
    apiUrl: process.env.VNPAY_URL,
    returnUrl: process.env.VNPAY_RETURN_URL,
  },
});

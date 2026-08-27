const generateTransactionReference = () => {
  const timestamps = Date.now();
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `Tx${timestamps}${randomNumber}`;
};

module.exports = generateTransactionReference;

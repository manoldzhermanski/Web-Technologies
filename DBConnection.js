const mongoose = require("mongoose");

module.exports = connectDb = () => {
    const password = "Q3TaAL0yZa0dZspa";
    return mongoose.connect(`mongodb+srv://team18:${password}@cloudpaint.pubjv6n.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};
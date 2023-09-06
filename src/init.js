//- 필요한 모든것들을 import

import "./db.js"; //db.js 파일 자체를 import
import "./models/Video.js";
import app from "./server.js";

const PORT = 4000;

const handleListening = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
};

app.listen(PORT, handleListening);

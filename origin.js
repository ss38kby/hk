
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

const ADMIN_PATH = "/admin";
const ADMIN_PASSWORD = "admin123";

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  // 后台登录页
  if (pathname === ADMIN_PATH && method === "GET") {
    return new Response(`
      <html>
        <head><title>BPB 后台登录</title></head>
        <body style="font-family: sans-serif; text-align:center; padding:2em;">
          <h2>BPB Panel 后台登录</h2>
          <form method="POST" action="/admin">
            <input type="password" name="password" placeholder="请输入后台密码" />
            <br/><br/>
            <button type="submit">登录</button>
          </form>
        </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" }
    });
  }

  // 登录验证
  if (pathname === ADMIN_PATH && method === "POST") {
    const formData = await request.formData();
    const password = formData.get("password");
    if (password === ADMIN_PASSWORD) {
      return new Response(`
        <html>
          <head><title>BPB 控制面板</title></head>
          <body style="font-family: sans-serif; text-align:center; padding:2em;">
            <h2>✅ 登录成功！欢迎使用 BPB Worker Panel</h2>
            <p>你可以在这里自定义 UUID、路径、TLS 等设置。</p>
          </body>
        </html>
      `, {
        headers: { "Content-Type": "text/html" }
      });
    } else {
      return new Response("❌ 密码错误，请返回重试。", {
        status: 403
      });
    }
  }

  // 默认响应 UUID 生成逻辑
  if (pathname === "/" || pathname === "/index") {
    const uuid = crypto.randomUUID();
    return new Response(`
      <html>
        <head><title>BPB Worker 面板</title></head>
        <body style="font-family: sans-serif; text-align:center; padding:2em;">
          <h2>🚀 BPB Worker 已部署成功</h2>
          <p>这是一个自动生成的 UUID：<br/><strong>${uuid}</strong></p>
          <p>访问 <code>/admin</code> 进入后台（密码：admin123）</p>
        </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" }
    });
  }

  // 其他路径默认处理
  return new Response("404 Not Found", { status: 404 });
}

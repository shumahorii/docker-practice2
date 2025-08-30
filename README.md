
# Docker Practice (Spring Boot + React)

このプロジェクトは **Spring Boot (backend)** と **React (Vite + TypeScript, frontend)** を  
Docker 上で動かす開発環境です。  

- **フロントエンド** → Vite の HMR (Hot Module Replacement) で修正即反映  
- **バックエンド** → Spring Boot DevTools + `bootRun` でソース修正時に自動再起動  

---

## 🚀 起動方法

### 1. 起動
```bash
docker-compose up --build
````

* 初回は backend で Gradle 本体や依存をダウンロードするため、数分かかる場合があります。
* 2回目以降はキャッシュされ、数秒で立ち上がります。

### 2. アクセス先

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:8080/api/hello](http://localhost:8080/api/hello)

---

## 🛑 停止・削除

```bash
# コンテナを停止 & 削除
docker-compose down
```

個別に削除したい場合：

```bash
docker ps -a
docker stop <コンテナID>
docker rm <コンテナID>
```

---

## 🔄 ソースコード修正の反映

### フロントエンド (React + Vite)

* `frontend/src/` を編集すると **自動でブラウザに反映**されます。
* Vite の HMR が有効。

### バックエンド (Spring Boot)

* `backend/src/` を編集すると **DevTools により自動再起動**されます。
* jar の再ビルドは不要です。

---

## 🌐 フロントエンドからバックエンドへのアクセス

例: `App.tsx` で API を呼ぶコード

```tsx
useEffect(() => {
  fetch("http://localhost:8080/api/hello")
    .then((res) => res.text())
    .then((data) => setMessage(data));
}, []);
```

### CORS 対応

CORS エラーが出る場合、Spring Boot コントローラに以下を追加してください：

```java
@CrossOrigin(origins = "http://localhost:5173")
@GetMapping("/hello")
public String hello() {
    return "Hello from Spring Boot!";
}
```

---

## 📝 補足

* この構成は **開発用** です。
* 本番ではフロントを `npm run build` でビルドして静的ファイル化し、
  Nginx や Spring Boot の静的リソースとして配信するのがおすすめです。

```

---

これで「起動 → 停止 → ソース変更の反映 → フロントからバックアクセス → CORS対応」まで全部カバーしました ✅  

👉 Shumaさん、これに **本番用（Nginx配信構成）の章**も追記しておきますか？
```


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

---

# ソースを変えると即座に反映される仕組み

いい質問です！👏
「なぜソースを変えると即座に反映されるのか」を仕組みから説明しますね。

---

## 🔑 理由：**volume マウント**しているから

`docker-compose.yml` にこう書いてありますよね👇

```yaml
volumes:
  - ./backend:/app
  - ./frontend:/app
```

* ホストの `./backend` や `./frontend` ディレクトリを **コンテナの `/app` にそのまま共有**しています。
* つまり、コンテナ内のファイルを直接コピーしてるのではなく、**ホストとコンテナで同じファイルを参照している状態**。

→ なので、ホスト側で `src` を編集すると、コンテナの中でもファイルが即座に置き換わって見えます。

---

## 🌀 自動リロードが効く理由

### フロントエンド (Vite)

* Vite は **ファイル監視**をしていて、変更を検知するとブラウザに差分を送ってリロード（HMR）します。
* ファイルが volume で共有されてるから、ホストで保存すると即座に Vite が検知してブラウザに反映。

### バックエンド (Spring Boot + DevTools)

* DevTools が **class ファイルや resources** の変更を監視していて、差分があれば Spring Boot を再起動します。
* volume でソースやビルド成果物を共有しているので、ホストで保存するとコンテナ側でも変更が見えて自動再起動される。

---

## ✨ まとめ

* コンテナの中身は **都度再コピーされているわけじゃない**
* volume マウントで **ホストのファイルとコンテナが同じものを参照**しているから「即座に反映」される
* 実際のリロードは **Vite や DevTools の監視機能**がやってくれている

---

# JSX（Reactの書き方）を書くときに注意すること


JSXはJavaScriptの中にHTMLを記述するために生まれた方法です。ほとんどHTMLを同じように書けますが注意点があるので紹介します。

## コンポーネント
```jsx
const page=()=>{
  return(
    <div>
    {/* ここに中身を書く！ */}
    </div>
  )
}

```
JSXではコンポーネント（≒部品）を組み合わせて作ります。すべての部品はJavaScriptの *関数* として定義します。その際上のような形式で書いていってください。
return ()の中に *必ず一つだけ* タグが入る必要があります。divタグで囲うことが多いです。  
よくない例
```jsx
const page=()=>{
  return(
    <h1>タイトル</h1>
    <h2>記事一覧</h2>
  )
}
```
よい例：必ず一つでくくる！
```jsx
const page=()=>{
  return(
    <div>
      <h1>タイトル</h1>
      <h2>記事一覧</h2>
    </div>
  )
}
```

## HTMLとJSXの違い
### classとclassName
```html
<!-- HTMLの書き方 -->
<h1 class="title">タイトル</h1>
```

```jsx
{/* JSXの書き方 */}
<h1 className="title">タイトル</h1>
```

HTMLのclassはJSXではclassNameと書きます

### forとhtmlFor

```html
<!-- HTMLの書き方 -->
<form>
  <label for="name">名前</label>
  <input id="name" />
</form>
```

HTMLのforはJSXではhtmlForと書きます
```jsx
{/* JSXの書き方 */}
<form>
  <label for="name">名前</label>
  <input id="name" />
</form>
```
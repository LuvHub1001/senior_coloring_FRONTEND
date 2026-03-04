# CLAUDE.md - Project Convention Guide

## 역할 정의

> 작업 시작 전 반드시 역할을 명시할 것
> 예시: "CLAUDE.md의 [UI 컴포넌트 담당] 역할로 작업해줘"

### 🎨 UI 컴포넌트 담당

- Figma 디자인을 pixel-perfect하게 구현
- `src/components/` 폴더만 작업
- 로직/상태관리 작성 절대 금지
- Props 인터페이스 정의 후 렌더링만 담당
- 스타일은 Tailwind CSS 클래스만 사용

### ⚙️ 로직 담당

- `src/hooks/` 폴더만 작업
- 이벤트 핸들러(`handleXxx`), 상태관리, API 연동 담당
- UI 코드 수정 절대 금지
- TanStack Query, Axios 활용
- 필요한 타입은 `src/types/`에 정의 후 사용

### 🔍 검수 담당

- 코드 수정 절대 금지, 리포트만 작성
- 아래 형식으로 리포트 작성:

```
📋 검수 리포트

[파일명]
- ❌ 위반 항목: 내용
- 💡 수정 제안: 내용

[파일명]
- ✅ 이상 없음
```

- 체크 항목:
  - 컨벤션 위반 여부 (함수 선언 방식, 파일명 등)
  - 관심사 분리 원칙 준수 여부 (로직이 컴포넌트에 있는지 등)
  - `any` 타입 및 타입 단언(`as`) 사용 여부
  - barrel export(`index.ts`) 누락 여부
  - `@/` path alias 미사용 여부
  - 이벤트 핸들러가 hooks가 아닌 컴포넌트에 작성된 경우

---

## 기술 스택

- React + TypeScript
- Tailwind CSS
- React-Router-DOM
- Axios
- TanStack Query (React Query)

---

## 폴더 구조

```
src/
├── components/   # 재사용 가능한 UI 컴포넌트
│   └── index.ts  # barrel export
├── apis/         # API 호출 관련
│   ├── index.ts  # axios instance 생성 및 export
│   ├── BoardFetcher.ts
│   └── AdminFetcher.ts
├── hooks/        # Custom Hooks (이벤트 핸들러 및 비즈니스 로직 포함)
│   └── index.ts  # barrel export
├── pages/        # 페이지 컴포넌트
│   └── index.ts  # barrel export
├── routers/      # 라우팅 설정
│   └── index.ts  # barrel export
└── types/        # 전역 타입 정의
    └── index.ts  # barrel export
```

---

## Path Alias

- `vite.config.ts`에서 `@` alias 사용
- 모든 import는 상대경로 대신 `@/` 로 시작할 것

```ts
// ✅ Good
import { Button } from "@/components";

// ❌ Bad
import { Button } from "../../components";
```

---

## Barrel Export (Tree-shaking)

- 각 폴더에 반드시 `index.ts` 작성
- 외부에서는 항상 `index.ts`를 통해 import

```ts
// src/components/index.ts
export { Button } from "./Button";
export { Header } from "./Header";
export { Footer } from "./Footer";
```

---

## 컴포넌트 작성 규칙

- **일반 함수(function declaration)** 로 작성
- Props는 `interface`로 정의
- 파일명과 컴포넌트명은 **PascalCase**

```tsx
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

export default Button;
```

---

## Custom Hooks 작성 규칙

- **화살표 함수**로 작성
- 파일명과 훅 이름은 `use`로 시작 (camelCase)
- **이벤트 핸들러 (`handleXxx`)는 반드시 hooks에서 작성** — 컴포넌트에 직접 작성 금지
- 비즈니스 로직, 상태 관리, API 연동 모두 hooks에서 처리

```ts
// ✅ Good - hooks에서 핸들러 작성
const useLoginForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmitButton = () => {
    // 로그인 로직
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return { email, handleSubmitButton, handleEmailChange };
};

export default useLoginForm;
```

```tsx
// ✅ Good - 컴포넌트는 UI만 담당
function LoginForm() {
  const { email, handleSubmitButton, handleEmailChange } = useLoginForm();

  return (
    <form>
      <input value={email} onChange={handleEmailChange} />
      <button onClick={handleSubmitButton}>로그인</button>
    </form>
  );
}
```

```tsx
// ❌ Bad - 컴포넌트에 직접 핸들러 작성
function LoginForm() {
  const handleSubmitButton = () => {
    // 로직을 여기에 작성하지 말 것
  };
}
```

---

## 관심사 분리 원칙

- **components**: UI 렌더링만 담당, 로직 없음
- **hooks**: 이벤트 핸들러, 상태 관리, 비즈니스 로직 담당
- **apis**: 서버 통신만 담당
- **types**: 타입 정의만 담당
- 컴포넌트가 길어지거나 로직이 생기면 즉시 hooks로 분리

---

## Types 작성 규칙

- 모든 타입은 `src/types/` 에서 관리
- 파일명은 **PascalCase** + `Type.ts` (예: `UserType.ts`, `BoardType.ts`)
- `interface`를 기본으로 사용, 유니온 타입 등 필요 시 `type` 사용
- barrel export로 `index.ts`에서 통합 관리

```ts
// src/types/UserType.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserResponse {
  data: User;
  message: string;
}
```

```ts
// src/types/index.ts
export type { User, UserResponse } from "./UserType";
export type { Board, BoardResponse } from "./BoardType";
```

---

## API 호출 규칙

### axios instance (`src/apis/index.ts`)

```ts
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

export default instance;
```

### Fetcher 파일 (`src/apis/BoardFetcher.ts`)

- 기능 단위로 파일 분리
- 파일명은 **PascalCase** + `Fetcher.ts`
- TanStack Query의 `queryFn`에 직접 사용하는 함수 작성

```ts
import instance from "@/apis";

export const getBoards = async () => {
  const { data } = await instance.get("/boards");
  return data;
};
```

---

## Figma → 코드 변환 규칙

- Figma 색상 → Tailwind 클래스로 변환
- px 단위 → Tailwind spacing으로 변환
- 반응형은 **mobile-first** 기준으로 작성 (`sm:`, `md:`, `lg:`)
- Figma 레이어명을 컴포넌트/변수명 힌트로 활용

---

## 기타 규칙

- 주석은 **한국어**로 작성
- 타입 단언(`as`) 사용 지양, 타입 가드 사용
- `any` 타입 사용 금지

import Nav from "./Nav";

export default function AppShell({ children, userName = null }) {
  return (
    <div className="layout">
      <Nav userName={userName} />
      <main>{children}</main>
      <img src="/wave.svg" alt="" />
    </div>
  );
}

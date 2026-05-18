import { auth } from "~/server/auth";
import { Navbar, Footer } from "~/app/_components/layout-parts";

export default async function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const sessionData = session
    ? {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role ?? "USER",
        },
      }
    : null;

  return (
    <>
      <Navbar session={sessionData} />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}

// app/page.tsx
import Header from "@/components/Header";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import UseExistingEmail from "@/components/UseExistingEmail";

export default function Page() {
  return (
    <main>
      <Header />
      <UseExistingEmail />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
}

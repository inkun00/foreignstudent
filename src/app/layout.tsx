import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "다옴톡 (DaomTalk) - 이주배경 초등학생 공감 메신저",
  description: "대한민국 내 이주배경 초등학생들이 겪는 실제 학교·가정 생활과 고충을 공감하고 이해하도록 돕는 카카오톡 시뮬레이션 메신저입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

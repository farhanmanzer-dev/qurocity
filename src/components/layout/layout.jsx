import React from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import ScrollReveal from "../motion/scrollReveal";
import SmoothScroll from "../motion/smoothScroll";

const Layout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <SmoothScroll />
      <Header />
      <ScrollReveal>
        {children}
        <Footer />
      </ScrollReveal>
    </div>
  );
};

export default Layout;

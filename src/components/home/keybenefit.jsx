import React from "react";
import key1 from "../../assets/images/Picture1.png";
import key2 from "../../assets/images/Picture2.png";
import key3 from "../../assets/images/Picture3.png";
import TiltCard from "../motion/tiltCard";

const Keybenefit = () => {
  return (
    <section id="benefits" className="keybenefit-content">
      <div className="container">
        <div className="keybenefit-content-wrapper">
          <h1 data-aos="fade-down">
            Key benefits of learning a new language with Qurocity
          </h1>
          <div className="keybenefit-box-wrapper">
            <TiltCard className="keybenefit-box" max={6} wrapProps={{ "data-aos": "fade-up" }}>
              <img src={key1} alt="key" />
              <p>
                There are no age restrictions or skill gaps to learning new
                languages. We help you take control of your life and unlock your
                growth potential.
              </p>
            </TiltCard>
            <TiltCard className="keybenefit-box" max={6} wrapProps={{ "data-aos": "fade-up" }}>
              <img src={key2} alt="key" />
              <p>
                Multilingual students are better equipped to ace academics and
                internationalize their careers. We help turn simple curiosities
                into life-changing realities.
              </p>
            </TiltCard>
            <TiltCard className="keybenefit-box" max={6} wrapProps={{ "data-aos": "fade-up" }}>
              <img src={key3} alt="key" />
              <p>
                There are no age restrictions or skill gaps to learning new
                languages. We help you take control of your life and unlock your
                growth potential.
              </p>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Keybenefit;

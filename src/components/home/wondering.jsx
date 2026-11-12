import React from "react";
import { FcGraduationCap } from "react-icons/fc";
import { FcBarChart } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import { FcGlobe } from "react-icons/fc";
import { FcIdea } from "react-icons/fc";
import { FcSportsMode } from "react-icons/fc";
import TiltCard from "../motion/tiltCard";

const WonderingSection = () => {
  return (
    <section id="why-learn" className="wonder-content">
      <div className="container">
        <div className="wonder-content-wrapper">
          <h1 data-aos="fade-down">
            Wondering how learning a foreign language is going to benefit you ?
          </h1>
          <div className="wonder-box-content">
            <TiltCard className="wonder-box" wrapProps={{ "data-aos": "zoom-in" }}>
              <FcGraduationCap fill="#fff" size={60} />
              <h4>Academic Excellence</h4>
              <p>
                Ace exams like SAT & GRE and outperform the rest in
                school/college interviews.
              </p>
            </TiltCard>
            <TiltCard className="wonder-box" wrapProps={{ "data-aos": "zoom-in" }}>
              <FcBarChart fill="#fff" size={60} />
              <h4>Dream Careers</h4>
              <p>
                Boost your resume to world-class standards and apply for
                international job positions.
              </p>
            </TiltCard>
            <TiltCard className="wonder-box" wrapProps={{ "data-aos": "zoom-in" }}>
              <FcPortraitMode stroke="#fff" size={60} />
              <h4>Real-Life Skills</h4>
              <p>
                Pick up valuable skills, such as multitasking, problem-solving,
                conflict management, etc.
              </p>
            </TiltCard>
            <TiltCard className="wonder-box" wrapProps={{ "data-aos": "zoom-in" }}>
              <FcIdea fill="#fff" size={60} />
              <h4>Cognitive Focus</h4>
              <p>
                Raise your level of cognitive intelligence and sharpen your
                overall thinking process.
              </p>
            </TiltCard>
            <TiltCard className="wonder-box" wrapProps={{ "data-aos": "zoom-in" }}>
              <FcSportsMode fill="#fff" size={60} />
              <h4>Self-Confidence Boost</h4>
              <p>
                Amplify your confidence levels to easily maximize strengths and
                manage weaknesses.
              </p>
            </TiltCard>
            <TiltCard className="wonder-box" wrapProps={{ "data-aos": "zoom-in" }}>
              <FcGlobe fill="#fff" size={60} />
              <h4>Cultural Empathy</h4>
              <p>
                Gain a deeper cultural perspective of diverse cultures and be
                more empathetic.
              </p>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WonderingSection;

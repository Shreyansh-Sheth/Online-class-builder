import HeroEditable from "./editable/hero";
import Features from "./editable/features";
import Testimonial from "./editable/testimonial";
export const sections = [
  { name: "Hero", component: <HeroEditable />, draggable: false },
  { name: "Features", component: <Features />, draggable: true },
  { name: "Testimonial", component: <Testimonial />, draggable: true },
  { name: "Footer", component: <div>Footer</div>, draggable: false },
];

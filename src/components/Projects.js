// Prefixes a public/ path with Vite's base URL (needed on GitHub Pages)
export const asset = (path) => (path ? `${import.meta.env.BASE_URL}${path}` : "");

export function getProjects(isMobile) {
  return [
    {
      id: "litteria",
      title: "Litteria",
    //   subtitle: "front-end, website",
      technologies: "react, next.js, lenis, framer, bootstrap",
      link: "https://litteria-new.vercel.app/",
      top: isMobile ? null : "18%",
      left: isMobile ? null : "72%",
      summary: "A website for an independent bookstore.",
      tagline1: "Books displayed in harmonious chaos.",
      tagline2: "Getting lost in the rows of books.",
      tagline3: "",
      description1: "Tasked with turning a fictitious independent bookstore's catalogue into an online experience, I took inspiration from the feeling of comforting overwhelm one can feel upon entering a bookstore, surrounded by rows and stacks of books displayed in harmonious chaos. The goal was to create a catalogue that would evoke that feeling while staying intuitive enough to actually find, read about and buy a book.",
      description2: "I’ve re-worked this project since the training ended, wanting to overhaul its design and achieve this sleek and elegant look and make it more intuitive to use.\nThe design is very minimalist, using black and white with a dash of green and gray as accent colors,  letting the book covers speak for themselves and allowing the user to be drawn to them and getting lost in the rows of books.\nThe cart and book details component was designed as to evoke a book mark.\nThe website's WCAG performance was tested using the Accessible Web Helper Chrome extension, passing it with a 98/100 score.",
      description3: "I used a Claude-generated Python script to collect book details from a Brussels-based bookstore, in order to have relevant content to build the catalog of Litteria.\nIt was designed and built using Next.js and external animation libraries to offer an optimal navigation experience.\nMain functionalities include: user authentication, login system, shopping cart (without payment integration).\nA full version would ideally include a back-end system, along with additional pages such as an ‘About’ and a ‘Contact’ page featuring a contact form, category-based filters, a way for the user to find books similar to the one selected, previous and next navigation.\nIt uses Framer Motion animations and Lenis scroll to add fluidity to the movements and to provide a smooth navigation experience. And Bootstrap toolkit for faster coding.",
      show1: "images/litteria1.png",
      show2: "images/litteria2.png",
      show3: "images/litteria3.png",
      caption1: "Homepage of Litteria",
      caption2: "",
      caption3: "",
    },
  ];
}
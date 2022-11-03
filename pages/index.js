import { useEffect, useRef } from "react";

export default function HomePage() {
  const viewer = useRef(null);

  useEffect(() => {
    import("@pdftron/webviewer").then(() => {
      WebViewer(
        {
          path: "/webviewer/lib",
          initialDoc: "/files/pdftron_about.pdf",
        },
        viewer.current
      ).then((instance) => {
        instance.UI.setHeaderItems((header) => {
          header.push({
            type: "actionButton",
            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            onClick: async () => {
              // save the annotations
              console.log(
                await annotationManager.exportAnnotations({
                  links: false,
                  widgets: false,
                })
                // await annotationManager.getAnnotCommand()
              );
            },
          });
        });

        // const { docViewer, Annotations } = instance;
        // const annotationManager = docViewer.getAnnotationManager();
        // // you can now call WebViewer APIs here...
        const { documentViewer, annotationManager, Annotations } =
          instance.Core;

        annotationManager.addEventListener("annotationChanged", async () => {
          // ...
          console.log(
            await annotationManager.exportAnnotations({
              links: false,
              widgets: false,
            })
          );
        });

        // documentViewer.addEventListener("documentLoaded", () => {
        documentViewer.on("documentLoaded", () => {
          annotationManager.setCurrentUser("jeffrey");

          const rectangleAnnot = new Annotations.RectangleAnnotation({
            PageNumber: 1,
            // values are in page coordinates with (0, 0) in the top left
            X: 100,
            Y: 150,
            Width: 200,
            Height: 50,
            Author: annotationManager.getCurrentUser(),
          });

          annotationManager.addAnnotation(rectangleAnnot);
          // need to draw the annotation otherwise it won't show up until the page is refreshed
          annotationManager.redrawAnnotation(rectangleAnnot);
        });

        // const ano = await annotationManager.exportAnnotations({
        //   links: false,
        //   widgets: false,
        // });
      });
    });
  }, []);

  return (
    <div className="MyComponent">
      <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
    </div>
  );
}

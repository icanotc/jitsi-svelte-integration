<script>
import pdfjs from "@bundled-es-modules/pdfjs-dist/build/pdf";
import viewer from "@bundled-es-modules/pdfjs-dist/web/pdf_viewer";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/build/pdf.worker.min.js";
var url = "./public/test.pdf";
var loadingTask = pdfjs.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');
  
  // Fetch the first page
  var pageNumber = 1;
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');
    
    var scale = 1.5;
    var viewport = page.getViewport({scale: scale});

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      console.log('Page rendered');
    });
  });
}, function (reason) {
  // PDF loading error
  console.error(reason);
});
</script>

<div>
    <canvas id="the-canvas"></canvas>
</div>
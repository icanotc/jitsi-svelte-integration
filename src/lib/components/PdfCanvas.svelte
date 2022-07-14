<script>
import pdfjs from "@bundled-es-modules/pdfjs-dist/build/pdf";
import viewer from "@bundled-es-modules/pdfjs-dist/web/pdf_viewer";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/build/pdf.worker.min.js";
var url = "./public/sample.pdf";
var loadingTask = pdfjs.getDocument(url);
let pageNumber = 1;
let totalPages;

//determines the number of pages in the pdf 
loadingTask.promise.then(function (doc) {
    totalPages = doc.numPages;
    console.log('# Document Loaded');
});


loadPage(pageNumber);

//loads previous page
function leftPage(){

    if(pageNumber != 1){
        pageNumber--;
        loadPage(pageNumber);
    }
    
}

//loads next page
function rightPage(){

    if(pageNumber != totalPages){
        pageNumber++;
        loadPage(pageNumber);
    }
    
}

function pdfUpload(url){
    let pdf = url.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(pdf);
    reader.onload = e => {
        pageNumber = 1;
        url = e.target.result;
        loadingTask = pdfjs.getDocument(url);
        loadingTask.promise.then(
            (doc) => totalPages=doc.numPages
        );
        loadPage(pageNumber);
    };
    
}

//loads page onto canvas 
function loadPage(page){
    loadingTask.promise.then(function(pdf) {
        
        // Fetch the first page
        pdf.getPage(page).then(function(page) {
            
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
            });
        });
        }, function (reason) {
        // PDF loading error
        console.error(reason);
        });
}

</script>

<h1>{pageNumber}</h1>

<!-- Upload Pdf -->
<button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-14">

	<input accept="application/pdf" type="file" id="PdfUpload" name="files" style="display: none;"
	    on:change={(url) => pdfUpload(url) }/>

	<label for="PdfUpload" id="LblBrowse">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
		</svg>
	</label>
</button>

<!-- page left -->
<button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-14">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         width="16" height="16" viewBox="0 0 199.404 199.404" xml:space="preserve" fill="white" on:click={leftPage}>
        <g>
            <polygon points="199.404,81.529 74.742,81.529 127.987,28.285 99.701,0 0,99.702 99.701,199.404 127.987,171.119 74.742,117.876 
            199.404,117.876 "/>
        </g>
    </svg>
</button>

<!-- page right -->
<button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-14">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="16" height="16" viewBox="0 0 199.404 199.404" xml:space="preserve" fill="white" on:click={rightPage}>
    <g>
        <polygon points="99.703,199.405 199.405,99.702 99.703,0 71.418,28.285 124.662,81.529 0,81.529 0,117.876 124.662,117.876 
        71.418,171.12 "/>
    </g>
    </svg>
</button>

<canvas id="the-canvas"></canvas>

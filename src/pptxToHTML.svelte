<!-- https://pptx.js.org/pages/docs.html -->

<link rel="stylesheet" href="./css/pptxjs.css">
<link rel="stylesheet" href="./css/nv.d3.min.css"> <!-- for charts graphs -->


<script type="text/javascript" src="./js/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="./js/jszip.min.js"></script> <!-- v2.. , NOT v.3.. -->
<script type="text/javascript" src="./js/filereader.js"></script> <!--https://github.com/meshesha/filereader.js -->
<script type="text/javascript" src="./js/d3.min.js"></script> <!-- for charts graphs -->
<script type="text/javascript" src="./js/nv.d3.min.js"></script> <!-- for charts graphs -->
<script type="text/javascript" src="./js/pptxjs.js"></script>
<script type="text/javascript" src="./js/divs2slides.js"></script> <!-- for slide show -->    




<div id="your_div_id_result"></div>
          optional:
<input id="upload_pptx_fiile" type="file" />






<script type="text/javascript">
            $("#your_div_id_result").pptxToHtml({
              pptxFileUrl: "path/to/yore_pptx_file.pptx", 
              fileInputId: "upload_pptx_fiile",
              slidesScale: "", //Change Slides scale by percent
              slideMode: false,
              keyBoardShortCut: false,
              mediaProcess: true, /** true,false: if true then process video and audio files */
              slideModeConfig: {  //on slide mode (slideMode: true)
                first: 1,
                nav: false, /** true,false : show or not nav buttons*/
                navTxtColor: "white", /** color */
                showPlayPauseBtn: false,/** true,false */
                keyBoardShortCut: false, /** true,false */
                showSlideNum: false, /** true,false */
                showTotalSlideNum: false, /** true,false */
                autoSlide: false, /** false or seconds (the pause time between slides) , F8 to active(keyBoardShortCut: true) */
                randomAutoSlide: false, /** true,false ,autoSlide:true */ 
                loop: false,  /** true,false */
                background: "black", /** false or color*/
                transition: "default", /** transition type: "slid","fade","default","random" , to show transition efects :transitionTime > 0.5 */
                transitionTime: 1 /** transition time in seconds */           
              }
            });
</script>
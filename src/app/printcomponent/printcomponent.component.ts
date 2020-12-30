import { Component, OnInit } from '@angular/core';
import * as PDFJS from 'ng2-pdfjs-viewer/pdfjs/build/pdf';
import { Router } from '@angular/router';

@Component({
  selector: 'app-printcomponent',
  templateUrl: './printcomponent.component.html',
  styleUrls: ['./printcomponent.component.css']
})
export class PrintcomponentComponent implements OnInit {

  constructor( public router: Router,) { }
  previousUrl;
  ngOnInit() {
    this.previousUrl = localStorage.getItem('previousUrl');
    this.previewPage();
  }
previewPage(){
  const fileData = localStorage.getItem('printData');
  localStorage.removeItem('printData')
            const pdfData = atob(fileData);
            
            // Loaded via <script> tag, create shortcut to access PDF.js exports.
            // const pdfjsLib = window['pdfjs-dist/build/pdf'];
        
            // The workerSrc property shall be specified.
            // pdfjsLib.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';
            PDFJS.workerSrc = '../../node_modules/ng2-pdfjs-viewer/pdfjs/build/pdf.worker.js';
            // Using DocumentInitParameters object to load binary data.
            const loadingTask = PDFJS.getDocument({ data: pdfData });
            loadingTask.promise.then((pdf) => {
               //How many pages it has
            const numPages = pdf.numPages;
            console.log(numPages);
            
            // Fetch one page
            const pageNumber = 1;
            let renderTask;
            for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
              pdf.getPage(pageNumber).then((page) => {
        
                let scale = 15;
                let viewport = page.getViewport(scale);
          
                // Prepare canvas using PDF page dimensions
                let canvas: any = document.getElementById('the-canvas');
                let wrapper: any = document.getElementById('wrapper');
          
                let context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                canvas.style.width = '160%';
                canvas.style.height = '160%';
          
                wrapper.style.width = Math.floor(viewport.width / scale) + 'pt';
                wrapper.style.height = Math.floor(viewport.height / scale) + 'pt';
                
              // Render PDF page into canvas context
                const renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                 renderTask = page.render(renderContext);
                 renderTask.then(() => {
                  window.print();
                  setTimeout(
                    () => {
    localStorage.setItem('previousUrl',this.previousUrl);
                      
                      this.router.navigate([this.previousUrl]);
                    }, 1000);
                });
              });
              if(renderTask){
                renderTask.cancel();
              }
            }
            
            // One Page ends
            }, (reason) => {
            // PDF loading error
              console.error(reason);
            }); 
}
}

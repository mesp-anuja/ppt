import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import WebViewer from '@pdftron/webviewer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('viewer', { static: false }) viewer: ElementRef;
  wvInstance: any;

  ngAfterViewInit(): void {

    WebViewer({
      path: '../lib',
      accessibleMode: true,
      isReadOnly: true,
      loadAsPDF: false,
      enableFilePicker: true,
      ui: 'beta',
      initialDoc: '../files/Dev-requirments-Phase 1 2020-1.pptx'
    }, this.viewer.nativeElement).then(instance => {
      this.wvInstance = instance;
      console.log(instance);

      instance.setHeaderItems(header => {
        // console.log(header);
        // const items = header.getItems().slice(0, 10);
        // header.update(items);
      });

      // now you can access APIs through this.webviewer.getInstance()
      // instance.openElements(['notesPanel']);
      // see https://www.pdftron.com/documentation/web/guides/ui/apis for the full list of APIs

      // or listen to events from the viewer element
      this.viewer.nativeElement.addEventListener('pageChanged', (e) => {
        const [ pageNumber ] = e.detail;
      });

      // or from the docViewer instance
      instance.docViewer.on('annotationsLoaded', () => {
      });

      instance.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler)
    });
  }

  ngOnInit() {
    this.wvDocumentLoadedHandler = this.wvDocumentLoadedHandler.bind(this);
  }

  wvDocumentLoadedHandler(): void {
    // you can access docViewer object for low-level APIs
    const docViewer = this.wvInstance;
    const annotManager = this.wvInstance.annotManager;
    // and access classes defined in the WebViewer iframe
    const { Annotations } = this.wvInstance;
    const rectangle = new Annotations.RectangleAnnotation();
    rectangle.PageNumber = 1;
    rectangle.X = 100;
    rectangle.Y = 100;
    rectangle.Width = 250;
    rectangle.Height = 250;
    rectangle.StrokeThickness = 5;
    rectangle.Author = annotManager.getCurrentUser();
    annotManager.addAnnotation(rectangle);
    annotManager.drawAnnotations(rectangle.PageNumber);
    // see https://www.pdftron.com/api/web/WebViewer.html for the full list of low-level APIs
  }
}

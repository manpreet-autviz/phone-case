import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
declare const google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tabActive = 'sticker';
  scaleValue = 1;
  inputText: string = 'Your Name';
  stickers = [
    { src: '../assets/images/stickers/cute/burger.png', alt: 'burger' },
    { src: '../assets/images/stickers/cute/cactus.png', alt: 'cactus' },
    { src: '../assets/images/stickers/cute/diamond.png', alt: 'diamond' },
    { src: '../assets/images/stickers/cute/fries.png', alt: 'fries' },
    { src: '../assets/images/stickers/cute/happy.png', alt: 'happy' },
    { src: '../assets/images/stickers/cute/heart.png', alt: 'heart' },
    { src: '../assets/images/stickers/cute/kiss.png', alt: 'kiss' },
    { src: '../assets/images/stickers/cute/lolipop.png', alt: 'lolipop' },
    { src: '../assets/images/stickers/cute/poop.png', alt: 'poop' },
    { src: '../assets/images/stickers/cute/popsicle.png', alt: 'popsicle' },
    { src: '../assets/images/stickers/cute/pot.png', alt: 'pot' },
    { src: '../assets/images/stickers/cute/rainbow.png', alt: 'rainbow' },
    {
      src: '../assets/images/stickers/cute/rollingstones.png',
      alt: 'rollingstones',
    },
    { src: '../assets/images/stickers/cute/strawberry.png', alt: 'strawberry' },
  ];

  summerStickers = [
    { src: '../assets/images/stickers/summer/enjoy.png', alt: 'enjoy' },
    {
      src: '../assets/images/stickers/summer/hellosunshine.png',
      alt: 'hellosunshine',
    },
    { src: '../assets/images/stickers/summer/holiday.png', alt: 'holiday' },
    { src: '../assets/images/stickers/summer/paradise.png', alt: 'paradise' },
    {
      src: '../assets/images/stickers/summer/summerflipflops.png',
      alt: 'summer flip-flops',
    },
    {
      src: '../assets/images/stickers/summer/summertime.png',
      alt: 'summer time',
    },
    { src: '../assets/images/stickers/summer/surf.png', alt: 'surf' },
    {
      src: '../assets/images/stickers/summer/vacationshark.png',
      alt: 'vacation shark',
    },
  ];
  fontStyle = [
    { fontFamily: 'League Script' },
    { fontFamily: 'Dancing Script' },
    { fontFamily: 'Great Vibes' },
    { fontFamily: 'Sacramento' },
    { fontFamily: 'Sue Ellen Francisco' },
    { fontFamily: 'Cabin Sketch' },
  ];
  colors = [
    { name: 'default', hexColor: '#212121' },
    { name: 'white', hexColor: '#fafafa' },
    { name: 'lime', hexColor: '#ece24d' },
    { name: 'passion', hexColor: '#f0bc2d' },
    { name: 'strawberry', hexColor: '#ee5576' },
    { name: 'cherry', hexColor: '#e75baf' },
    { name: 'avocado', hexColor: '#0cdda5' },
    { name: 'acqua', hexColor: '#31c4e9' },
    { name: 'blueberry', hexColor: '#619be2' },
    { name: 'grape', hexColor: '#8576db' },
  ];
  backgroundUrl: string = '';
  backgroundPosition: string = 'right top';
  backgroundSize: string = 'cover';
  textColor: string = '#212121';
  textShadow: string = '';
  whiteOutline: string =
    '-1px -1px 0 #757575, 1px -1px 0 #757575, -1px 1px 0 #757575, 1px 1px 0 #757575';
  selectedImage!: HTMLElement;
  private images: HTMLImageElement[] = [];
  private imageIndex = 0;
  private selectedDiv!: HTMLElement;
  private isScaling = false;
  private startScaleX = 0;
  private startScaleY = 0;
  private startScale = 0;
  private isRotating = false;

  private startRotation = 0;
  style: any;
  type!: string;
  @ViewChild('widgetIcons') widgetIcons!: ElementRef;

  isEdit: boolean = false;
  private clickListener!: () => void;
  scaleObject: boolean = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  setBackgroundImage(src: string) {
    this.backgroundUrl = src;
  }
  setBackgroundSize(size: any) {
    this.backgroundSize = size;
  }

  setAlignmentImage(alignment: any) {
    this.backgroundPosition = alignment;
  }

  setFontColor(color: any) {
    this.textColor = color;

    this.textShadow = this.textColor === '#fafafa' ? this.whiteOutline : '';
  }
  selectTab(tab: string) {
    this.tabActive = tab;
  }

  onDragStart(event: any, src: any, type: string): void {
    this.type = type;
    if (type === 'sticker') {
      // event.dataTransfer.setData('text/plain', src);
      event.dataTransfer.setData('targetId', 'canvas');
    } else {
      this.style = src;
      event.dataTransfer.setData(
        'text/plain',
        (event.target as HTMLElement).innerText
      );

      event.dataTransfer.setData('targetId', 'canvas');
    }
  }

  onDragOver(event: any): void {
    // Prevent default behavior to allow drop
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  onDrop(event: any): void {
    event.preventDefault();
    const src = event.dataTransfer.getData('text/plain');
    const targetId = event.dataTransfer.getData('targetId');
    if (targetId === 'canvas') {
      if (this.type === 'sticker') {
        const image = new Image();
        image.src = src;
        image.id = `image-${this.imageIndex}`;
        image.style.position = 'absolute';
        image.style.top = event.offsetY + 'px';
        image.style.left = event.offsetX + 'px';
        image.style.height = '64px';
        image.style.width = '64px';
        image.style.cursor = 'move';
        image.style.zIndex = '0';
        image.setAttribute('draggable', 'true');

        this.images.push(image);
        
         image.addEventListener( 'click', () => {
          if (this.selectedDiv) {
            this.renderer.removeClass(this.selectedDiv, 'widget');
          }
          this.renderer.addClass(image, 'widget');
          this.selectedDiv = image;
          this.selectedImage = image;
          this.addClassToIconsDiv();
        });

        event.target.appendChild(image);
        
        this.imageIndex++;
      } else {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = src;
        tempDiv.style.fontSize = '24px';
        tempDiv.style.position = 'absolute';
        tempDiv.style.height = '64px';
        tempDiv.style.width = '64px';
        tempDiv.style.fontFamily = this.style;
        tempDiv.style.color = this.textColor;
        tempDiv.style.top = event.offsetY + 'px';
        tempDiv.style.left = event.offsetX + 'px';
        tempDiv.style.zIndex = '0';

        this.renderer.listen(tempDiv, 'click', () => {
          if (this.selectedDiv) {
            this.renderer.removeClass(this.selectedDiv, 'widget');
          }
          this.renderer.addClass(tempDiv, 'widget');
          this.selectedDiv = tempDiv;
          this.selectedImage = tempDiv;
          this.addClassToIconsDiv();
        });
        event.target.appendChild(tempDiv);
      }
    }
  }
  addClassToIconsDiv() {

    
    const nativeElement = this.widgetIcons.nativeElement;
    nativeElement.classList.add('iconsDiv');

    const iconsCss = nativeElement.classList; // this will give you the updated class list

    const testElement = this.renderer.selectRootElement('.iconsDiv', true);

    const width = this.selectedImage.clientWidth;
    const height = this.selectedImage.clientHeight;
    const left = this.selectedImage.offsetLeft;
    const top = this.selectedImage.offsetTop;
    const transform = this.selectedImage.style.transform;
    const fontSize = parseInt(this.selectedImage.style.fontSize);
    if (this.scaleObject) {
      let angle = 0;
      const sinA = Math.sin(this.toRad(angle));
      const cosA = Math.cos(this.toRad(angle));
      this.renderer.setStyle(testElement, 'width', `${width - 35}px`);
      this.renderer.setStyle(testElement, 'height', `${height - 5}px`);
      this.renderer.setStyle(testElement, 'left', `${left + 17}px`);
      this.renderer.setStyle(testElement, 'top', `${top + 14}px`);
      this.renderer.setStyle(
        testElement,
        'transform',
        `matrix(${cosA}, ${sinA}, ${-sinA}, ${cosA} , 0, 0)`
      );
      this.renderer.setStyle(testElement, 'font-size', fontSize);
    } else {
      this.renderer.setStyle(testElement, 'width', `${width + 2}px`);
      this.renderer.setStyle(testElement, 'height', `${height + 2}px`);
      this.renderer.setStyle(testElement, 'left', `${left - 1}px`);
      this.renderer.setStyle(testElement, 'top', `${top - 1}px`);
      this.renderer.setStyle(testElement, 'transform', transform);
      this.renderer.setStyle(testElement, 'font-size', fontSize);
    }
    
    this.isEdit = true;
  }
  toRad(angle: number) {
    return (angle * Math.PI) / 180;
  }
  downloadDiv() {
    const downloadDiv = document.getElementById('getCase');
    if (downloadDiv !== null) {
      html2canvas(downloadDiv, {
        useCORS: true,
        backgroundColor: null,
      }).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'download.png';
        link.href = image;
        link.click();
      });
    }
  }
  toggleIcon(){
    this.isEdit= !this.isEdit
    if(!this.isEdit){
      const elements = document.querySelectorAll('.widget');
      elements.forEach((element) => {
        this.renderer.setStyle(element, 'border', 'none');
      });
    
    }
  }
  delete() {
    const widgetEl = this.elementRef.nativeElement.querySelector('.widget');
    widgetEl.remove();

    this.isEdit = false;
  }

  bringForward() {
    let currentZIndex: number = parseInt(this.selectedImage.style.zIndex);
    let nextIndex = currentZIndex + 1;
    this.selectedImage.style.zIndex = nextIndex.toString();
  }

  sendBackward() {
    if (parseInt(this.selectedImage.style.zIndex) > 0) {
      let currentZIndex: number = parseInt(this.selectedImage.style.zIndex);
      let nextIndex = currentZIndex - 1;
      this.selectedImage.style.zIndex = nextIndex.toString();
    }
  }

  rotate(event: MouseEvent) {
    this.isRotating = true;
    const centerX =
      this.selectedImage.offsetLeft + this.selectedImage.offsetWidth / 2;
    const centerY =
      this.selectedImage.offsetTop + this.selectedImage.offsetHeight / 2;
    const angle =
      (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) /
      Math.PI;
    this.startRotation = parseFloat(
      this.selectedImage.style.transform
        .replace('rotate(', '')
        .replace('deg)', '')
    );
    if (isNaN(this.startRotation)) {
      this.startRotation = 0;
    }
  }

  scale(event: MouseEvent) {
    this.isScaling = true;

    this.startScaleX = event.clientX;
    this.startScaleY = event.clientY;
    this.startScale = parseFloat(
      this.selectedImage.style.transform.replace('scale(', '').replace(')', '')
    );
    if (isNaN(this.startScale)) {
      this.startScale = 1;
    }
  }
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isScaling) {
      const deltaX = event.clientX - this.startScaleX;
      const deltaY = event.clientY - this.startScaleY;
      const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const scale = this.startScale + delta / 100;
      this.selectedImage.style.transform = `scale(${scale})`;
      this.scaleObject = true;
      this.addClassToIconsDiv();
    }
    if (this.isRotating) {
      const centerX =
        this.selectedImage.offsetLeft + this.selectedImage.offsetWidth / 2;
      const centerY =
        this.selectedImage.offsetTop + this.selectedImage.offsetHeight / 2;
      const angle =
        (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) /
        Math.PI;
      const rotation = this.startRotation + angle;
      this.selectedImage.style.transform = `rotate(${rotation}deg)`;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isScaling = false;
    this.isRotating = false;
  }
}

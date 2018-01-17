<template lang="html">
  <div class="pdf-viewer">
    <header>
      <h1 id="title"></h1>
    </header>

    <div id="viewerContainer">
      <div id="viewer" class="pdfViewer"></div>
    </div>

    <div id="loadingBar">
      <div class="progress"></div>
      <div class="glimmer"></div>
    </div>

    <div id="errorWrapper" hidden="true">
      <div id="errorMessageLeft">
        <span id="errorMessage"></span>
        <button id="errorShowMore">
          More Information
        </button>
        <button id="errorShowLess">
          Less Information
        </button>
      </div>
      <div id="errorMessageRight">
        <button id="errorClose">
          Close
        </button>
      </div>
      <div class="clearBoth"></div>
      <textarea id="errorMoreInfo" hidden="true" readonly="readonly"></textarea>
    </div>

    <footer>
      <button class="toolbarButton pageUp" title="Previous Page" id="previous"></button>
      <button class="toolbarButton pageDown" title="Next Page" id="next"></button>

      <input type="number" id="pageNumber" class="toolbarField pageNumber" value="1" size="4" min="1">

      <button class="toolbarButton zoomOut" title="Zoom Out" id="zoomOut"></button>
      <button class="toolbarButton zoomIn" title="Zoom In" id="zoomIn"></button>
    </footer>
  </div>
</template>

<script>
import 'pdfjs-dist/web/pdf_viewer.css'
import 'pdfjs-dist/build/pdf.js'
import 'pdfjs-dist/web/pdf_viewer.js'

export default {
  // data () {
  //   return {
  //     url: ''
  //   }
  // },
  props: {
    url: {
      type: String,
      default: 'static/20171212105319-lijh-南土财务报销制度.pdf'
    }
  },
  mounted () {
    const pdfjsLib = require('pdfjs-dist')
    const PDFJS = pdfjsLib.PDFJS
    PDFJS.useOnlyCssZoom = true
    PDFJS.disableTextLayer = true
    PDFJS.maxImageSize = 1024 * 1024
    PDFJS.workerSrc = 'static/pdfjs-dist/build/pdf.worker.js'
    PDFJS.cMapUrl = 'static/pdfjs-dist/cmaps/'
    PDFJS.cMapPacked = true

    const DEFAULT_SCALE_DELTA = 1.1
    const MIN_SCALE = 0.25
    const MAX_SCALE = 10.0
    const DEFAULT_SCALE_VALUE = 'auto'

    const PDFViewerApplication = {
      pdfLoadingTask: null,
      pdfDocument: null,
      pdfViewer: null,
      pdfHistory: null,
      pdfLinkService: null,

      open: function (params) {
        if (this.pdfLoadingTask) {
          // We need to destroy already opened document
          return this.close().then(function () {
            // ... and repeat the open() call.
            return this.open(params)
          }.bind(this))
        }

        var url = params.url
        var self = this
        console.log('this', this)
        this.setTitleUsingUrl(url)

        // Loading document.
        var loadingTask = PDFJS.getDocument(url)
        this.pdfLoadingTask = loadingTask

        loadingTask.onProgress = function (progressData) {
          self.progress(progressData.loaded / progressData.total)
        }

        return loadingTask.promise.then((pdfDocument) => {
          // Document loaded, specifying document for the viewer.
          self.pdfDocument = pdfDocument
          self.pdfViewer.setDocument(pdfDocument)
          self.pdfLinkService.setDocument(pdfDocument)
          self.pdfHistory.initialize(pdfDocument.fingerprint)

          self.loadingBar.hide()
          self.setTitleUsingMetadata(pdfDocument)
        }, (exception) => {
          var message = exception && exception.message
          var l10n = self.l10n
          var loadingErrorMessage

          if (exception instanceof PDFJS.InvalidPDFException) {
            // change error message also for other builds
            loadingErrorMessage = l10n.get('invalid_file_error', null,
              'Invalid or corrupted PDF file.')
          } else if (exception instanceof PDFJS.MissingPDFException) {
            // special message for missing PDFs
            loadingErrorMessage = l10n.get('missing_file_error', null,
              'Missing PDF file.')
          } else if (exception instanceof PDFJS.UnexpectedResponseException) {
            loadingErrorMessage = l10n.get('unexpected_response_error', null,
              'Unexpected server response.')
          } else {
            loadingErrorMessage = l10n.get('loading_error', null,
              'An error occurred while loading the PDF.')
          }

          loadingErrorMessage.then((msg) => {
            self.error(msg, {message: message})
          })
          self.loadingBar.hide()
        })
      },

      close: function () {
        var errorWrapper = document.getElementById('errorWrapper')
        errorWrapper.setAttribute('hidden', 'true')

        if (!this.pdfLoadingTask) {
          return Promise.resolve()
        }

        var promise = this.pdfLoadingTask.destroy()
        this.pdfLoadingTask = null

        if (this.pdfDocument) {
          this.pdfDocument = null

          this.pdfViewer.setDocument(null)
          this.pdfLinkService.setDocument(null, null)
        }

        return promise
      },

      get loadingBar () {
        var bar = new PDFJS.ProgressBar('#loadingBar', {})

        return PDFJS.shadow(this, 'loadingBar', bar)
      },

      setTitleUsingUrl: function (url) {
        this.url = url
        var title = PDFJS.getFilenameFromUrl(url) || url
        try {
          title = decodeURIComponent(title)
        } catch (e) {
          // decodeURIComponent may throw URIError,
          // fall back to using the unprocessed url in that case
        }
        this.setTitle(title)
      },

      setTitleUsingMetadata: function (pdfDocument) {
        var self = this
        pdfDocument.getMetadata().then((data) => {
          var info = data.info
          var metadata = data.metadata
          self.documentInfo = info
          self.metadata = metadata

          // Provides some basic debug information
          console.log('PDF ' + pdfDocument.fingerprint + ' [' +
                      info.PDFFormatVersion + ' ' + (info.Producer || '-').trim() +
                      ' / ' + (info.Creator || '-').trim() + ']' +
                      ' (PDF.js: ' + (PDFJS.version || '-') +
                      (!PDFJS.disableWebGL ? ' [WebGL]' : '') + ')')

          var pdfTitle
          if (metadata && metadata.has('dc:title')) {
            var title = metadata.get('dc:title')
            // Ghostscript sometimes returns 'Untitled', so prevent setting the
            // title to 'Untitled.
            if (title !== 'Untitled') {
              pdfTitle = title
            }
          }

          if (!pdfTitle && info && info['Title']) {
            pdfTitle = info['Title']
          }

          if (pdfTitle) {
            self.setTitle(pdfTitle + ' - ' + document.title)
          }
        })
      },

      setTitle: function (title) {
        document.title = title
        document.getElementById('title').textContent = title
      },

      error: function (message, moreInfo) {
        var l10n = this.l10n
        var moreInfoText = [l10n.get('error_version_info',
          {version: PDFJS.version || '?', build: PDFJS.build || '?'},
          'PDF.js v{{version}} (build: {{build}})')]

        if (moreInfo) {
          moreInfoText.push(
            l10n.get('error_message', {message: moreInfo.message},
              'Message: {{message}}'))
          if (moreInfo.stack) {
            moreInfoText.push(
              l10n.get('error_stack', {stack: moreInfo.stack},
                'Stack: {{stack}}'))
          } else {
            if (moreInfo.filename) {
              moreInfoText.push(
                l10n.get('error_file', {file: moreInfo.filename},
                  'File: {{file}}'))
            }
            if (moreInfo.lineNumber) {
              moreInfoText.push(
                l10n.get('error_line', {line: moreInfo.lineNumber},
                  'Line: {{line}}'))
            }
          }
        }

        var errorWrapper = document.getElementById('errorWrapper')
        errorWrapper.removeAttribute('hidden')

        var errorMessage = document.getElementById('errorMessage')
        errorMessage.textContent = message

        var closeButton = document.getElementById('errorClose')
        closeButton.onclick = () => {
          errorWrapper.setAttribute('hidden', 'true')
        }

        var errorMoreInfo = document.getElementById('errorMoreInfo')
        var moreInfoButton = document.getElementById('errorShowMore')
        var lessInfoButton = document.getElementById('errorShowLess')
        moreInfoButton.onclick = () => {
          errorMoreInfo.removeAttribute('hidden')
          moreInfoButton.setAttribute('hidden', 'true')
          lessInfoButton.removeAttribute('hidden')
          errorMoreInfo.style.height = errorMoreInfo.scrollHeight + 'px'
        }
        lessInfoButton.onclick = () => {
          errorMoreInfo.setAttribute('hidden', 'true')
          moreInfoButton.removeAttribute('hidden')
          lessInfoButton.setAttribute('hidden', 'true')
        }
        moreInfoButton.removeAttribute('hidden')
        lessInfoButton.setAttribute('hidden', 'true')
        Promise.all(moreInfoText).then((parts) => {
          errorMoreInfo.value = parts.join('\n')
        })
      },

      progress: function (level) {
        var percent = Math.round(level * 100)
        // Updating the bar if value increases.
        if (percent > this.loadingBar.percent || isNaN(percent)) {
          this.loadingBar.percent = percent
        }
      },

      get pagesCount () {
        return this.pdfDocument.numPages
      },

      set page (val) {
        this.pdfViewer.currentPageNumber = val
      },

      get page () {
        return this.pdfViewer.currentPageNumber
      },

      zoomIn: function (ticks) {
        var newScale = this.pdfViewer.currentScale
        do {
          newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2)
          newScale = Math.ceil(newScale * 10) / 10
          newScale = Math.min(MAX_SCALE, newScale)
        } while (--ticks && newScale < MAX_SCALE)
        this.pdfViewer.currentScaleValue = newScale
      },

      zoomOut: function (ticks) {
        var newScale = this.pdfViewer.currentScale
        do {
          newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2)
          newScale = Math.floor(newScale * 10) / 10
          newScale = Math.max(MIN_SCALE, newScale)
        } while (--ticks && newScale > MIN_SCALE)
        this.pdfViewer.currentScaleValue = newScale
      },

      initUI: function () {
        var linkService = new PDFJS.PDFLinkService()
        this.pdfLinkService = linkService

        this.l10n = PDFJS.NullL10n

        var container = document.getElementById('viewerContainer')
        var pdfViewer = new PDFJS.PDFViewer({
          container: container,
          linkService: linkService,
          l10n: this.l10n
        })
        this.pdfViewer = pdfViewer
        linkService.setViewer(pdfViewer)

        this.pdfHistory = new PDFJS.PDFHistory({
          linkService: linkService
        })
        linkService.setHistory(this.pdfHistory)

        document.getElementById('previous').addEventListener('click', () => {
          PDFViewerApplication.page--
        })

        document.getElementById('next').addEventListener('click', () => {
          PDFViewerApplication.page++
        })

        document.getElementById('zoomIn').addEventListener('click', () => {
          PDFViewerApplication.zoomIn()
        })

        document.getElementById('zoomOut').addEventListener('click', () => {
          PDFViewerApplication.zoomOut()
        })

        document.getElementById('pageNumber').addEventListener('click', function () {
          this.select()
        })

        document.getElementById('pageNumber').addEventListener('change', function () {
          PDFViewerApplication.page = (this.value | 0)

          // Ensure that the page number input displays the correct value, even if the
          // value entered by the user was invalid (e.g. a floating point number).
          if (this.value !== PDFViewerApplication.page.toString()) {
            this.value = PDFViewerApplication.page
          }
        })

        container.addEventListener('pagesinit', () => {
          // We can use pdfViewer now, e.g. let's change default scale.
          pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE
        })

        container.addEventListener('pagechange', (evt) => {
          var page = evt.pageNumber
          var numPages = PDFViewerApplication.pagesCount

          document.getElementById('pageNumber').value = page
          document.getElementById('previous').disabled = (page <= 1)
          document.getElementById('next').disabled = (page >= numPages)
        }, true)
      }
    }
    // console.log('PDFViewerApplication', PDFViewerApplication.initUI)
    // eslint-disable-next-line
    PDFViewerApplication.initUI()

    // eslint-disable-next-line
    // (function animationStartedClosure () {
      // The offsetParent is not set until the PDF.js iframe or object is visible.
      // Waiting for first animation.
    PDFViewerApplication.animationStartedPromise = new Promise(
      (resolve) => {
        window.requestAnimationFrame(resolve)
      }
    )
    // })()

    // We need to delay opening until all HTML is loaded.
    PDFViewerApplication.animationStartedPromise.then(() => {
      PDFViewerApplication.open({
        url: this.url
      })
    })

    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  }
}
</script>

<style lang="css">
* {
  padding: 0;
  margin: 0;
}

.pdf-viewer {
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-size: 10px;
  background: url(../assets/pdf/document_bg.png);
  color: #fff;
  font-family: sans-serif;
  /*font-size: 10px;
  height: 100%;
  width: 100%;
  overflow: hidden;*/
  padding-bottom: 5rem;
}

header {
  background-color: #f4f4f4;
}

header h1 {
  border-bottom: 1px solid #d8d8d8;
  color: #858585;
  font-size: 23px;
  font-style: italic;
  font-weight: normal;
  overflow: hidden;
  padding: 10px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*body {
  background: url(../assets/pdf/document_bg.png);
  color: #fff;
  font-family: sans-serif;
  font-size: 10px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding-bottom: 5rem;
}*/

section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 2rem;
}

footer {
  background-image: url(../assets/pdf/toolbar_background.png);
  height: 4rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  box-shadow: 0 -0.2rem 0.5rem rgba(50, 50, 50, 0.75);
}

.toolbarButton {
  display: block;
  padding: 0;
  margin: 0;
  border-width: 0;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: transparent;
}

.toolbarButton.pageUp {
  position: absolute;
  width: 18%;
  height: 100%;
  left: 0;
  background-image: url(../assets/pdf/icon_previous_page.png);
  background-size: 2rem;
}

.toolbarButton.pageDown {
  position: absolute;
  width: 18%;
  height: 100%;
  left: 18%;
  background-image: url(../assets/pdf/icon_next_page.png);
  background-size: 2rem;
}

#pageNumber {
  -moz-appearance: textfield; /* hides the spinner in moz */
  position: absolute;
  width: 28%;
  height: 100%;
  left: 36%;
  text-align: center;
  border: 0;
  background-color: transparent;
  font-size: 1.2rem;
  color: #FFF;
  background-image: url(../assets/pdf/div_line_left.png), url(../assets/pdf/div_line_right.png);
  background-repeat: no-repeat;
  background-position: left, right;
  background-size: 0.2rem, 0.2rem;
}

.toolbarButton.zoomOut {
  position: absolute;
  width: 18%;
  height: 100%;
  left: 64%;
  background-image: url(../assets/pdf/icon_zoom_out.png);
  background-size: 2.4rem;
}

.toolbarButton.zoomIn {
  position: absolute;
  width: 18%;
  height: 100%;
  left: 82%;
  background-image: url(../assets/pdf/icon_zoom_in.png);
  background-size: 2.4rem;
}

.toolbarButton[disabled] {
  opacity: .3;
}

.hidden {
  display: none;
}
[hidden] {
  display: none !important;
}

#viewerContainer {
  position: absolute;
  overflow: auto;
  width: 100%;
  top: 5rem;
  bottom: 4rem;
  left: 0;
  right: 0;
}

canvas {
  margin: auto;
  display: block;
}

.pdfViewer .page .loadingIcon {
  width: 2.9rem;
  height: 2.9rem;
  background: url("../assets/pdf/spinner.png") no-repeat left top / 38rem ;
  border: medium none;
  animation: 1s steps(10, end) 0s normal none infinite moveDefault;
  display: block;
  position: absolute;
  top: calc((100% - 2.9rem) / 2);
  left: calc((100% - 2.9rem) / 2);
}

@keyframes moveDefault {
  from {
    background-position: 0 top;
  }

  to {
    background-position: -39rem top;
  }
}

#loadingBar {
  position: relative;
  height: .6rem;
  background-color: #333;
  border-bottom: 1px solid #333;
  margin-top: 5rem;
}

#loadingBar .progress {
  position: absolute;
  left: 0;
  width: 0;
  height: 100%;
  background-color: #ddd;
  overflow: hidden;
  transition: width 200ms;
}

@keyframes progressIndeterminate {
  0% { left: 0; }
  50% { left: 100%; }
  100% { left: 100%; }
}

#loadingBar .progress.indeterminate {
  background-color: #999;
  transition: none;
}

#loadingBar .indeterminate .glimmer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 5rem;

  background-image: linear-gradient(to right, #999 0%, #fff 50%, #999 100%);
  background-size: 100% 100%;
  background-repeat: no-repeat;

  animation: progressIndeterminate 2s linear infinite;
}

#errorWrapper {
  background: none repeat scroll 0 0 #FF5555;
  color: white;
  left: 0;
  position: absolute;
  right: 0;
  top: 3.2rem;
  z-index: 1000;
  padding: 0.3rem;
  font-size: 0.8em;
}

#errorMessageLeft {
  float: left;
}

#errorMessageRight {
  float: right;
}

#errorMoreInfo {
  background-color: #FFFFFF;
  color: black;
  padding: 0.3rem;
  margin: 0.3rem;
  width: 98%;
}
</style>

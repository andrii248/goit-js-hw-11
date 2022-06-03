export default class LoadMoreImgsBtn {
  constructor({ hidden = false }) {
    this.refs = this.getRefs();

    hidden && this.hide();
  }

  getRefs() {
    const refs = {};
    refs.loadBtn = document.querySelector('.load-more');
    refs.spinner = refs.loadBtn.querySelector('.spinner');
    refs.text = refs.loadBtn.querySelector('.load-more_text');
    return refs;
  }

  show() {
    this.refs.loadBtn.classList.remove('is-hidden');
  }

  hide() {
    this.refs.loadBtn.classList.add('is-hidden');
  }

  enable() {
    this.refs.loadBtn.disabled = false;
    this.refs.spinner.classList.remove('spinner-border');
    this.refs.text.textContent = 'Load more';
  }

  disable() {
    this.refs.loadBtn.disabled = true;
    this.refs.spinner.classList.add('spinner-border');
    this.refs.text.textContent = 'Loading...';
  }
}

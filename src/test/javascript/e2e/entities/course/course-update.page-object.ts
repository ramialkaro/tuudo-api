import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class CourseUpdatePage {
  pageTitle: ElementFinder = element(by.id('tuudoApp.course.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  nameInput: ElementFinder = element(by.css('input#course-name'));
  pointInput: ElementFinder = element(by.css('input#course-point'));
  progressInput: ElementFinder = element(by.css('input#course-progress'));
  urlInput: ElementFinder = element(by.css('input#course-url'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return this.nameInput.getAttribute('value');
  }

  async setPointInput(point) {
    await this.pointInput.sendKeys(point);
  }

  async getPointInput() {
    return this.pointInput.getAttribute('value');
  }

  async setProgressInput(progress) {
    await this.progressInput.sendKeys(progress);
  }

  async getProgressInput() {
    return this.progressInput.getAttribute('value');
  }

  async setUrlInput(url) {
    await this.urlInput.sendKeys(url);
  }

  async getUrlInput() {
    return this.urlInput.getAttribute('value');
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setNameInput('name');
    expect(await this.getNameInput()).to.match(/name/);
    await waitUntilDisplayed(this.saveButton);
    await this.setPointInput('5');
    expect(await this.getPointInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setProgressInput('5');
    expect(await this.getProgressInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setUrlInput('url');
    expect(await this.getUrlInput()).to.match(/url/);
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}

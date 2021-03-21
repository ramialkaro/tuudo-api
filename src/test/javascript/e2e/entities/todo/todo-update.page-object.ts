import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class TodoUpdatePage {
  pageTitle: ElementFinder = element(by.id('tuudoApp.todo.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  titleInput: ElementFinder = element(by.css('input#todo-title'));
  startAtInput: ElementFinder = element(by.css('input#todo-startAt'));
  endAtInput: ElementFinder = element(by.css('input#todo-endAt'));
  descriptionInput: ElementFinder = element(by.css('input#todo-description'));
  statusSelect: ElementFinder = element(by.css('select#todo-status'));
  prioritySelect: ElementFinder = element(by.css('select#todo-priority'));
  courseSelect: ElementFinder = element(by.css('select#todo-course'));
  schoolSelect: ElementFinder = element(by.css('select#todo-school'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTitleInput(title) {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput() {
    return this.titleInput.getAttribute('value');
  }

  async setStartAtInput(startAt) {
    await this.startAtInput.sendKeys(startAt);
  }

  async getStartAtInput() {
    return this.startAtInput.getAttribute('value');
  }

  async setEndAtInput(endAt) {
    await this.endAtInput.sendKeys(endAt);
  }

  async getEndAtInput() {
    return this.endAtInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  async setStatusSelect(status) {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect() {
    return this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption() {
    await this.statusSelect.all(by.tagName('option')).last().click();
  }
  async setPrioritySelect(priority) {
    await this.prioritySelect.sendKeys(priority);
  }

  async getPrioritySelect() {
    return this.prioritySelect.element(by.css('option:checked')).getText();
  }

  async prioritySelectLastOption() {
    await this.prioritySelect.all(by.tagName('option')).last().click();
  }
  async courseSelectLastOption() {
    await this.courseSelect.all(by.tagName('option')).last().click();
  }

  async courseSelectOption(option) {
    await this.courseSelect.sendKeys(option);
  }

  getCourseSelect() {
    return this.courseSelect;
  }

  async getCourseSelectedOption() {
    return this.courseSelect.element(by.css('option:checked')).getText();
  }

  async schoolSelectLastOption() {
    await this.schoolSelect.all(by.tagName('option')).last().click();
  }

  async schoolSelectOption(option) {
    await this.schoolSelect.sendKeys(option);
  }

  getSchoolSelect() {
    return this.schoolSelect;
  }

  async getSchoolSelectedOption() {
    return this.schoolSelect.element(by.css('option:checked')).getText();
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
    await this.setTitleInput('title');
    expect(await this.getTitleInput()).to.match(/title/);
    await waitUntilDisplayed(this.saveButton);
    await this.setStartAtInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getStartAtInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(this.saveButton);
    await this.setEndAtInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getEndAtInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(this.saveButton);
    await this.setDescriptionInput('description');
    expect(await this.getDescriptionInput()).to.match(/description/);
    await waitUntilDisplayed(this.saveButton);
    await this.statusSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.prioritySelectLastOption();
    await this.courseSelectLastOption();
    await this.schoolSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}

import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class TodoHistoryUpdatePage {
  pageTitle: ElementFinder = element(by.id('tuudoApp.todoHistory.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  startAtInput: ElementFinder = element(by.css('input#todo-history-startAt'));
  endAtInput: ElementFinder = element(by.css('input#todo-history-endAt'));
  todoSelect: ElementFinder = element(by.css('select#todo-history-todo'));

  getPageTitle() {
    return this.pageTitle;
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

  async todoSelectLastOption() {
    await this.todoSelect.all(by.tagName('option')).last().click();
  }

  async todoSelectOption(option) {
    await this.todoSelect.sendKeys(option);
  }

  getTodoSelect() {
    return this.todoSelect;
  }

  async getTodoSelectedOption() {
    return this.todoSelect.element(by.css('option:checked')).getText();
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
    await this.setStartAtInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getStartAtInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(this.saveButton);
    await this.setEndAtInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getEndAtInput()).to.contain('2001-01-01T02:30');
    await this.todoSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}

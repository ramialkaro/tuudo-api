import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import TodoUpdatePage from './todo-update.page-object';

const expect = chai.expect;
export class TodoDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('tuudoApp.todo.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-todo'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class TodoComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('todo-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('todo');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateTodo() {
    await this.createButton.click();
    return new TodoUpdatePage();
  }

  async deleteTodo() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const todoDeleteDialog = new TodoDeleteDialog();
    await waitUntilDisplayed(todoDeleteDialog.deleteModal);
    expect(await todoDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/tuudoApp.todo.delete.question/);
    await todoDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(todoDeleteDialog.deleteModal);

    expect(await isVisible(todoDeleteDialog.deleteModal)).to.be.false;
  }
}

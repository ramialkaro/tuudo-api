import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import CourseUpdatePage from './course-update.page-object';

const expect = chai.expect;
export class CourseDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('tuudoApp.course.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-course'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class CourseComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('course-heading'));
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
    await navBarPage.getEntityPage('course');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateCourse() {
    await this.createButton.click();
    return new CourseUpdatePage();
  }

  async deleteCourse() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const courseDeleteDialog = new CourseDeleteDialog();
    await waitUntilDisplayed(courseDeleteDialog.deleteModal);
    expect(await courseDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/tuudoApp.course.delete.question/);
    await courseDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(courseDeleteDialog.deleteModal);

    expect(await isVisible(courseDeleteDialog.deleteModal)).to.be.false;
  }
}

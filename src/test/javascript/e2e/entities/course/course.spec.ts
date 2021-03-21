import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CourseComponentsPage from './course.page-object';
import CourseUpdatePage from './course-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Course e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let courseComponentsPage: CourseComponentsPage;
  let courseUpdatePage: CourseUpdatePage;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();
    await signInPage.username.sendKeys(username);
    await signInPage.password.sendKeys(password);
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    courseComponentsPage = new CourseComponentsPage();
    courseComponentsPage = await courseComponentsPage.goToPage(navBarPage);
  });

  it('should load Courses', async () => {
    expect(await courseComponentsPage.title.getText()).to.match(/Courses/);
    expect(await courseComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Courses', async () => {
    const beforeRecordsCount = (await isVisible(courseComponentsPage.noRecords)) ? 0 : await getRecordsCount(courseComponentsPage.table);
    courseUpdatePage = await courseComponentsPage.goToCreateCourse();
    await courseUpdatePage.enterData();

    expect(await courseComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(courseComponentsPage.table);
    await waitUntilCount(courseComponentsPage.records, beforeRecordsCount + 1);
    expect(await courseComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await courseComponentsPage.deleteCourse();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(courseComponentsPage.records, beforeRecordsCount);
      expect(await courseComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(courseComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

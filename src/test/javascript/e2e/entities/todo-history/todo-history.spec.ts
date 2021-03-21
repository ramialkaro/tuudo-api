import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import TodoHistoryComponentsPage from './todo-history.page-object';
import TodoHistoryUpdatePage from './todo-history-update.page-object';
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

describe('TodoHistory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let todoHistoryComponentsPage: TodoHistoryComponentsPage;
  let todoHistoryUpdatePage: TodoHistoryUpdatePage;
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
    todoHistoryComponentsPage = new TodoHistoryComponentsPage();
    todoHistoryComponentsPage = await todoHistoryComponentsPage.goToPage(navBarPage);
  });

  it('should load TodoHistories', async () => {
    expect(await todoHistoryComponentsPage.title.getText()).to.match(/Todo Histories/);
    expect(await todoHistoryComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete TodoHistories', async () => {
    const beforeRecordsCount = (await isVisible(todoHistoryComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(todoHistoryComponentsPage.table);
    todoHistoryUpdatePage = await todoHistoryComponentsPage.goToCreateTodoHistory();
    await todoHistoryUpdatePage.enterData();

    expect(await todoHistoryComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(todoHistoryComponentsPage.table);
    await waitUntilCount(todoHistoryComponentsPage.records, beforeRecordsCount + 1);
    expect(await todoHistoryComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await todoHistoryComponentsPage.deleteTodoHistory();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(todoHistoryComponentsPage.records, beforeRecordsCount);
      expect(await todoHistoryComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(todoHistoryComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

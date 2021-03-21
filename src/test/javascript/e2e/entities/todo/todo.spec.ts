import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import TodoComponentsPage from './todo.page-object';
import TodoUpdatePage from './todo-update.page-object';
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

describe('Todo e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let todoComponentsPage: TodoComponentsPage;
  let todoUpdatePage: TodoUpdatePage;
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
    todoComponentsPage = new TodoComponentsPage();
    todoComponentsPage = await todoComponentsPage.goToPage(navBarPage);
  });

  it('should load Todos', async () => {
    expect(await todoComponentsPage.title.getText()).to.match(/Todos/);
    expect(await todoComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Todos', async () => {
    const beforeRecordsCount = (await isVisible(todoComponentsPage.noRecords)) ? 0 : await getRecordsCount(todoComponentsPage.table);
    todoUpdatePage = await todoComponentsPage.goToCreateTodo();
    await todoUpdatePage.enterData();

    expect(await todoComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(todoComponentsPage.table);
    await waitUntilCount(todoComponentsPage.records, beforeRecordsCount + 1);
    expect(await todoComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await todoComponentsPage.deleteTodo();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(todoComponentsPage.records, beforeRecordsCount);
      expect(await todoComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(todoComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

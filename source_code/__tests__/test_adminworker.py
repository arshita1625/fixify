import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class TestAdminPage(unittest.TestCase):
    def setUp(self):
        # Set up the WebDriver before each test
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.wait = WebDriverWait(self.driver, 10)
        # Log in to the admin dashboard before each test
        self._login()

    def _login(self):
        # Helper method to log in
        self.driver.get("http://localhost:5173/signin")
        username_field = self.driver.find_element(By.NAME, "username")
        password_field = self.driver.find_element(By.NAME, "password")
        login_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
        username_field.send_keys("admin")
        password_field.send_keys("admin")
        login_button.click()
        time.sleep(2)
        self.driver.get("http://localhost:5173/admin")
       

    def test_admin_login(self):
        # Test the admin dashboard loads correctly
        welcome_text = self.driver.find_element(By.XPATH, "//h4[contains(text(), 'Welcome to Admin Dashboard')]")
        self.assertIn("Welcome to Admin Dashboard", welcome_text.text, "Admin dashboard heading not found!")
        total_customers = self.driver.find_element(By.XPATH, "//h6[contains(text(), 'Total Customers')]")
        self.assertTrue(total_customers.is_displayed(), "Total Customers card not displayed!")
        print("Admin dashboard test passed successfully!")

    def test_workers_page_basic(self):
        # Basic test for ManageWorkers page rendering
        self.driver.get("http://localhost:5173/admin/workers")
        self.wait.until(EC.url_to_be("http://localhost:5173/admin/workers"))

        # Verify heading
        manage_workers_heading = self.driver.find_element(By.XPATH, "//h4[contains(text(), 'Manage Workers')]")
        self.assertIn("Manage Workers", manage_workers_heading.text, "Manage Workers heading not found!")

        # Verify search field
        search_label = self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//label[contains(text(), 'Search workers...')]"))
        )
        self.assertTrue(search_label.is_displayed(), "Search workers label not found!")
        search_field = self.driver.find_element(By.XPATH, "//div[contains(@class, 'MuiTextField-root')]//input")
        self.assertTrue(search_field.is_displayed(), "Search workers input field not found!")

        # Verify table headers
        table_headers = self.driver.find_elements(By.XPATH, "//table//th")
        expected_headers = ["Name", "Email", "Service", "Rating", "Actions"]
        actual_headers = [header.text for header in table_headers]
        self.assertEqual(len(table_headers), 5, "Incorrect number of table headers!")
        for expected in expected_headers:
            self.assertIn(expected, actual_headers, f"Table header '{expected}' not found!")

        print("Workers page basic test passed successfully!")

    def test_workers_page_rows(self):
        # Test worker rows and buttons
        self.driver.get("http://localhost:5173/admin/workers")
        self.wait.until(EC.url_to_be("http://localhost:5173/admin/workers"))

        worker_rows = self.driver.find_elements(By.XPATH, "//table//tbody//tr")
        if worker_rows:
            first_row = worker_rows[0]
            cells = first_row.find_elements(By.TAG_NAME, "td")
            self.assertEqual(len(cells), 5, "Incorrect number of columns in worker row!")
            view_button = first_row.find_element(By.XPATH, ".//button[text()='View']")
            self.assertTrue(view_button.is_displayed(), "View button not found!")
            verify_or_verified_button = first_row.find_element(By.XPATH, ".//button[text()='Verify' or text()='Verified']")
            self.assertTrue(
                verify_or_verified_button.text in ["Verify", "Verified"],
                f"Expected 'Verify' or 'Verified', found '{verify_or_verified_button.text}'!"
            )
        else:
            print("No worker rows found; skipping row-specific tests.")

        print("Workers page rows test passed successfully!")

    def test_workers_page_view_modal(self):
        # Test clicking "View" button and modal visibility
        self.driver.get("http://localhost:5173/admin/workers")
        self.wait.until(EC.url_to_be("http://localhost:5173/admin/workers"))

        worker_rows = self.driver.find_elements(By.XPATH, "//table//tbody//tr")
        if worker_rows:
            first_row = worker_rows[0]
            view_button = first_row.find_element(By.XPATH, ".//button[text()='View']")
            view_button.click()
            modal = self.wait.until(
                EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'MuiModal-root')]"))
            )
            self.assertTrue(modal.is_displayed(), "ServiceProviderUpdateModal not displayed after clicking View!")
        else:
            print("No worker rows available; skipping View modal test.")

        print("Workers page View modal test passed successfully!")

    def test_workers_page_verify_action(self):
        # Test clicking "Verify" button and state change (if applicable)
        self.driver.get("http://localhost:5173/admin/workers")
        self.wait.until(EC.url_to_be("http://localhost:5173/admin/workers"))

        worker_rows = self.driver.find_elements(By.XPATH, "//table//tbody//tr")
        if worker_rows:
            first_row = worker_rows[0]
            verify_or_verified_button = first_row.find_element(By.XPATH, ".//button[text()='Verify' or text()='Verified']")
            if verify_or_verified_button.text == "Verify":
                verify_or_verified_button.click()
                self.wait.until(
                    EC.text_to_be_present_in_element(
                        (By.XPATH, ".//button[text()='Verified']"), "Verified"
                    )
                )
                updated_button = first_row.find_element(By.XPATH, ".//button[text()='Verified']")
                self.assertTrue(updated_button.is_displayed(), "Button did not change to Verified!")
                self.assertTrue(updated_button.get_attribute("disabled"), "Verified button should be disabled!")
            else:
                self.assertEqual(verify_or_verified_button.text, "Verified", "Expected Verified button!")
                self.assertTrue(verify_or_verified_button.get_attribute("disabled"), "Verified button should be disabled!")
        else:
            print("No worker rows available; skipping Verify action test.")

        print("Workers page Verify action test passed successfully!")

    def test_workers_page_empty_table(self):
        # Test behavior when no workers are present
        self.driver.get("http://localhost:5173/admin/workers")
        self.wait.until(EC.url_to_be("http://localhost:5173/admin/workers"))

        worker_rows = self.driver.find_elements(By.XPATH, "//table//tbody//tr")
        try:
            table_body = self.driver.find_element(By.XPATH, "//table//tbody")
            if not worker_rows:
                # Expect tbody to exist but allow it to be empty
                self.assertTrue(table_body.is_displayed(), "Table body not displayed when empty!")
                self.assertEqual(len(worker_rows), 0, "Expected no rows in table body!")
            else:
                self.driver.save_screenshot("workers_not_empty.png")
                self.fail("Workers present; expected empty table for this test.")
        except:
            # If tbody isn't found at all, this is acceptable for an empty state
            self.assertEqual(len(worker_rows), 0, "Expected no rows, but table body not found!")
            print("Table body not rendered when empty, which is acceptable.")

        print("Workers page empty table test passed successfully!")

    def tearDown(self):
        # Close the browser after each test
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
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

    def test_customers_page(self):
        # Test the ManageCustomers page by navigating directly
        # Step 1: Navigate to the customers page after login
        self.driver.get("http://localhost:5173/admin/customers")
        self.wait.until(EC.url_to_be("http://localhost:5173/admin/customers"))

        # Step 2: Verify the "Manage Customers" heading
        manage_customers_heading = self.driver.find_element(By.XPATH, "//h4[contains(text(), 'Manage Customers')]")
        self.assertIn("Manage Customers", manage_customers_heading.text, "Manage Customers heading not found!")

        # Step 3: Verify the search field (using label instead of placeholder)
        search_label = self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//label[contains(text(), 'Search customers...')]"))
        )
        self.assertTrue(search_label.is_displayed(), "Search customers label not found!")
        # Locate the associated input (sibling or descendant of the TextField)
        search_field = self.driver.find_element(By.XPATH, "//div[contains(@class, 'MuiTextField-root')]//input")
        self.assertTrue(search_field.is_displayed(), "Search customers input field not found!")

        # Step 4: Verify the table headers
        table_headers = self.driver.find_elements(By.XPATH, "//table//th")
        expected_headers = ["Name", "Email", "Registered on", "Actions"]
        actual_headers = [header.text for header in table_headers]
        self.assertEqual(len(table_headers), 4, "Incorrect number of table headers!")
        for expected in expected_headers:
            self.assertIn(expected, actual_headers, f"Table header '{expected}' not found!")

        # Step 5: Verify table rows and "View" button (if data exists)
        customer_rows = self.driver.find_elements(By.XPATH, "//table//tbody//tr")
        if customer_rows:
            self.assertTrue(len(customer_rows) > 0, "No customer rows found in the table!")
            first_row = customer_rows[0]
            cells = first_row.find_elements(By.TAG_NAME, "td")
            self.assertEqual(len(cells), 4, "Incorrect number of columns in customer row!")
            view_button = first_row.find_element(By.XPATH, ".//button[text()='View']")
            self.assertTrue(view_button.is_displayed(), "View button not found in customer row!")
            self.assertEqual(view_button.text, "View", "View button text incorrect!")

        print("Customers page test passed successfully!")

    def tearDown(self):
        # Close the browser after each test
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
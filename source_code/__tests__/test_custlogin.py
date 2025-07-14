import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time

class TestSignupCustomer(unittest.TestCase):
    def setUp(self):
        # Set up the WebDriver before each test
        self.driver = webdriver.Chrome()
        self.wait = WebDriverWait(self.driver, 10)
        timestamp = str(int(time.time()))
        self.dummy_data = {
            "first_name": "xwereetg",
            "last_name": "safsdf",
            "email": "qazxswedc@gmail.com", #unique email.
            "password": "qwer12tyuiop",
            "phone": "9879605476",
            "address_line1": "123 Man St",
            "city": "Brantford",
            "province": "Ontario",
            "postal_code": "N3T 0T9"
        }

    def tearDown(self):
        # Clean up after each test
        self.driver.quit()

    def test_successful_signup(self):
        # Navigate to the signup page
        self.driver.get("http://localhost:5173/create-account")

        # Fill out the form
        first_name_field = self.wait.until(EC.presence_of_element_located((By.NAME, "first_name")))
        first_name_field.send_keys(self.dummy_data["first_name"])

        last_name_field = self.driver.find_element(By.NAME, "last_name")
        last_name_field.send_keys(self.dummy_data["last_name"])

        email_field = self.driver.find_element(By.NAME, "email")
        email_field.send_keys(self.dummy_data["email"])

        password_field = self.driver.find_element(By.NAME, "password")
        password_field.send_keys(self.dummy_data["password"])

        phone_field = self.driver.find_element(By.NAME, "phone")
        phone_field.send_keys(self.dummy_data["phone"])

        address_field = self.driver.find_element(By.NAME, "line1")
        address_field.send_keys(self.dummy_data["address_line1"])

        city_field = self.driver.find_element(By.NAME, "city")
        city_field.send_keys(self.dummy_data["city"])

        province_dropdown = Select(self.driver.find_element(By.NAME, "province"))
        province_dropdown.select_by_visible_text(self.dummy_data["province"])

        postal_code_field = self.driver.find_element(By.NAME, "postal_code")
        postal_code_field.send_keys(self.dummy_data["postal_code"])

        # Submit the form
        submit_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_button.click()

        # Verify navigation to verify-customer page
        try:
            self.driver.get("http://localhost:5173/verify-customer")
            self.assertEqual(self.driver.current_url, "http://localhost:5173/verify-customer", "Did not navigate to verify-customer page")
        except:
            self.fail("Signup did not navigate to verify-customer page.")

if __name__ == "__main__":
    unittest.main()
#coverage run -m unittest test_login.py
#coverage report
#coverafe html

import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginPageComponentAndLoginTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:5173/signin")

    def tearDown(self):
        self.driver.quit()

    def test_components_displayed(self):
        """Test if all necessary components are displayed on the login page."""
        wait = WebDriverWait(self.driver, 10) # 10 second max wait time.
        self.assertTrue(wait.until(EC.visibility_of_element_located((By.XPATH, "//h4[text()='Welcome Back!']"))).is_displayed())
        #self.assertTrue(wait.until(EC.visibility_of_element_located((By.XPATH, "//h4[contains(text(), 'Login to Your Account')]"))).is_displayed())
        self.assertTrue(self.driver.find_element(By.NAME, "username").is_displayed())
        self.assertTrue(self.driver.find_element(By.NAME, "password").is_displayed())
        self.assertTrue(self.driver.find_element(By.XPATH, "//button[text()='Login']").is_displayed())
        #self.assertTrue(self.driver.find_element(By.XPATH, "//label[text()='Remember me']").is_displayed())
        self.assertTrue(self.driver.find_element(By.XPATH, "//img[@alt='Welcome Image']").is_displayed())


if __name__ == "__main__":
    unittest.main()
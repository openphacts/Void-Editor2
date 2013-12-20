package editor.domain;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

public class testVoidUpload {

	public static void main(String[] args) {

		//read file
		InputStream is = null;
		 
		try {
 
			 is = new FileInputStream("C:\\Users\\Lefteris\\Desktop\\Void-Editor2\\voidEditor\\src\\test\\res\\editor\\domain\\testVoid.ttl");
			 
			 VoidUpload temp = new VoidUpload(is);
			 
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				is.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}

}

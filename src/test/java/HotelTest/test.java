package HotelTest;

import org.junit.Test;

public class test {
    @Test
    public void fun(){
        int a=5;//这里设置菱形边长,必须是奇数
        for (int i=0;i<2*a-1;i++){
            for (int j=0;j<2*a-1;j++){
                if (Math.abs(j-i)==a/2*2||Math.abs(a/2*2-i)==j||Math.abs(a/2*2-i)+j==a/2*4){
                    System.out.print("*");
                }else{
                    System.out.print(" ");
                }
            }
            System.out.println();
        }
    }
}


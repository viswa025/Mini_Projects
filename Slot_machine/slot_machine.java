import java.sql.SQLOutput;
import java.util.*;
public class slot_machine{
    
    public static void main(String[] args){
        Scanner scan=new Scanner(System.in);
        int balance=0;
        int topup;
        int bet;
        String[] spin={"💵","🍒","🌟","🔔"};
        Random rand=new Random();
        boolean again=true;
        int add;
        String test;
        int spend=0;
        int profit=0;




        System.out.println("************************************");
        System.out.println("  Welcome to our Slot Machine Game");
        System.out.println("************************************");
        do{
        System.out.print("How much amount do you want to topup:₹");
        topup=scan.nextInt();
        scan.nextLine();
        if(topup>0) {
            balance+=topup;
            spend = spend + topup;

            break;}
        else{
            System.out.println("Invalid");
        }}while(true);
        do{
            System.out.println("Your Current balance is:₹"+balance);
         System.out.print("Enter Your bet amount:₹");
         bet=scan.nextInt();
         scan.nextLine();
        if(bet<=balance && bet>0 && balance>0) {
            balance-=bet;

            System.out.println("Your Current balance is:₹"+balance);
            }
        else{
            System.out.println("Invalid");
            System.out.println("Your Current balance is:₹"+balance);
            System.out.println("Do you want to add balance(Y/n):");
            test= scan.nextLine().toLowerCase();
            if (test.equals("n") ){

                break;

            }
            else if (test.equals("y")){
            System.out.print("How much amount do you want to topup:₹");
            add= scan.nextInt();
            scan.nextLine();
            if(add>0){balance+=add; spend+=topup;}}
            else {
                System.out.print("Invalid");
            }

            continue;
        }

        System.out.println("Spinning.....");

            int i=rand.nextInt(4);
            int j=rand.nextInt(4);
            int k=rand.nextInt(4);
            System.out.print(spin[i]+" "+spin[j]+" "+spin[k]+" \n");

            if(i==j && j==k) {
                balance += bet * 5;
                System.out.println("You have won:₹" + (bet * 5));
            }
            else if(i==j || j==k || k==i){
                balance+=bet*2;
                System.out.println("You have won:₹"+(bet*2));}
            else System.out.println("You lost the game");



            System.out.println("Your current balance:₹"+balance);


            System.out.print("Do you wish to continue(Y/N):");
            String Checkcontinue=scan.nextLine().toLowerCase();
            if (Checkcontinue.equals("n") ){

                again=false;

            }

            
        } while (again);
        System.out.println("You have spended:₹"+spend);
        if(balance>=spend) System.out.println("You have got:₹"+(balance-spend));
        else System.out.println("You have lose:₹"+(spend-balance));
        System.out.println("************************************");
        System.out.println("      Thank You,Visit again         ");
        System.out.println("************************************");

        
        
    }
}
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




        System.out.println("************************************");
        System.out.println("  Welcome to our Slot Machine Game");
        System.out.println("************************************");
        do{
        System.out.print("How much amount do you want to topup:₹");
        topup=scan.nextInt();
        scan.nextLine();
        if(topup>0) {
            balance+=topup;
            System.out.println("Your Current balance is:₹"+balance);
            break;}
        else{
            System.out.println("Invalid");
        }}while(true);
        do{
         System.out.print("Enter Your bet amount:₹");
         bet=scan.nextInt();
         scan.nextLine();
        if(bet<balance) {
            balance-=bet;
            System.out.println("Your Current balance is:₹"+balance);
            break;}
        else{
            System.out.println("Invalid");
        }}while(true);

        System.out.println("Spinning.....");
        do { 
            int i=rand.nextInt(4);
            int j=rand.nextInt(4);
            int k=rand.nextInt(4);
            System.out.print(spin[i]+" "+spin[j]+" "+spin[k]+" \n");



            System.out.print("Do you wish to continue(Yes/No)");
            String Checkcontinue=scan.nextLine().toLowerCase();
            if (Checkcontinue.equals("no") ){
                System.out.println("Thank you");
                again=false;

            }

            
        } while (again);

        
        
    }
}
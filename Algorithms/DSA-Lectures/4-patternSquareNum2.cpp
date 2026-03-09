/* Sqare Number 2
12345
12345
12345
12345
12345
*/
#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter Number:";
    cin>>n;
    
    int i=1;
    while(i<=n){
        int j=1;
        while (j<=n)
        {
            cout<<j;
            j+=1;
        }
        cout<<endl;
        i+=1;
        
    }
}

//cout<<n-j+1 for reverse order